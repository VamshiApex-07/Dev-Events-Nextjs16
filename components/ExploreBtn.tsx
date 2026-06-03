'use client';

import Image from "next/image";

const ExploreBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log('CLICK')}>
            <a href="#events">
                Explore Events
                <span className="relative inline-block size-[24px] shrink-0">
                    <Image src="/icons/arrow-down.svg" alt="arrow-down" fill sizes="24px" />
                </span>
            </a>
        </button>
    )
}

export default ExploreBtn