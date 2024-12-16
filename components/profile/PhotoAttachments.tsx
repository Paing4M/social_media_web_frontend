import React from 'react'
import Image from "next/image";
import {DownloadIcon} from "lucide-react";

type PhotoAttachmentsProps = {
  attachments: PostAttachmentInterface[]
  handlePreview: (idx: number) => void
}

const PhotoAttachments = ({attachments, handlePreview}: PhotoAttachmentsProps) => {
  return (
    <div
      className={`grid gap-3 grid-cols-1 sm:grid-cols-2`}
    >
      {attachments.map((att, idx) => (
        <div
          onClick={() => handlePreview(idx)}
          key={att.name + idx}
          className='relative h-full cursor-pointer'
        >
          <div className='relative h-full max-h-[350px]'>
            <Image
              unoptimized
              priority
              className='w-full rounded-md h-full object-cover'
              src={att.url!}
              width={120}
              height={120}
              alt='post-att'
            />
          </div>

          <a
            onClick={(e) => e.stopPropagation()}
            href={
              process.env.NEXT_PUBLIC_API_URL + '/api/download/' + att.id
            }
            download
            className='border-none block outline-none absolute top-2 z-10 right-2 bg-background rounded-md p-2'
          >
            <DownloadIcon className='size-5 '/>
          </a>

        </div>
      ))}

    </div>
  )
}
export default PhotoAttachments
