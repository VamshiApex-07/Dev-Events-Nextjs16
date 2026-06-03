import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}


const EventCard = ({ title, image, slug, location, date, time }: Props) => {
    return (
        <Link href={`/events/${slug}`} id="event-card">
            <div className="poster relative">
                <Image src={image} alt={title} fill sizes="410px" className="rounded-lg object-cover" />
            </div>

            <div className="flex flex-row gap-2 items-center">
                <span className="relative inline-block size-[14px] shrink-0">
                    <Image src="/icons/pin.svg" alt="location" fill sizes="14px" />
                </span>
                <p>{location}</p>
            </div>

            <p className="title">{title}</p>

            <div className="datetime">
                <div className="items-center">
                    <span className="relative inline-block size-[14px] shrink-0">
                        <Image src="/icons/calendar.svg" alt="date" fill sizes="14px" />
                    </span>
                    <p>{date}</p>
                </div>
                <div className="items-center">
                    <span className="relative inline-block size-[14px] shrink-0">
                        <Image src="/icons/clock.svg" alt="time" fill sizes="14px" />
                    </span>
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard