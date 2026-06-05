import mongoose, { Model, Schema, Types } from 'mongoose'
import { Event, type IEvent } from './event.model'

export interface IBooking {
  eventId: Types.ObjectId
  email: string
  createdAt?: Date
  updatedAt?: Date
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
  },
  { timestamps: true }
)

// Compound index: eventId + createdAt for common queries (events bookings by date)
bookingSchema.index({ eventId: 1, createdAt: -1 })

// Index on email for user booking lookups
bookingSchema.index({ email: 1 })

// Unique compound index: enforce one booking per event per email
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true })

// Pre-save hook to validate the referenced event exists before creating the booking
bookingSchema.pre('save', async function () {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId).select('_id')

      if (!eventExists) {
        const error = new Error(`Event with ID ${this.eventId} does not exist`)
        error.name = 'ValidationError'
        throw error
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'ValidationError') {
        throw err
      }
      const validationError = new Error('Invalid event ID format or database error')
      validationError.name = 'ValidationError'
      throw validationError
    }
  }
})

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking> | undefined) ?? mongoose.model<IBooking>('Booking', bookingSchema)

export { Booking }
