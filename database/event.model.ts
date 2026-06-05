import mongoose, { Model, Schema } from 'mongoose'

export interface IEvent {
  title: string
  slug?: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  startDateTime: Date
  mode: 'online' | 'offline' | 'hybrid'
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [1000, 'Overview cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
      maxlength: [500, 'Venue cannot exceed 500 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [500, 'Location cannot exceed 500 characters'],
    },
    startDateTime: {
      type: Date,
      required: [true, 'Start date and time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be one of: online, offline, hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
      maxlength: [200, 'Audience cannot exceed 200 characters'],
    },
    agenda: {
      type: [{ type: String, trim: true }],
      required: [true, 'Agenda is required'],
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
      maxlength: [200, 'Organizer cannot exceed 200 characters'],
    },
    tags: {
      type: [{ type: String, trim: true }],
      required: [true, 'Tags are required'],
    },
  },
  { timestamps: true }
)

eventSchema.pre('save', async function () {
  if (!this.isNew && !this.isModified('title')) return

  let slug = slugify(this.title)
  if (!slug) {
    throw new Error('Title must contain at least one alphanumeric character to generate a slug.')
  }

  const EventModel = mongoose.model<IEvent>('Event')
  const existing = await EventModel.findOne({ slug, _id: { $ne: this._id } })
  if (existing) {
    let counter = 1
    while (
      await EventModel.findOne({ slug: `${slug}-${counter}`, _id: { $ne: this._id } })
    ) {
      counter++
    }
    slug = `${slug}-${counter}`
  }

  this.slug = slug
})

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent> | undefined) ?? mongoose.model<IEvent>('Event', eventSchema)

export { Event }
