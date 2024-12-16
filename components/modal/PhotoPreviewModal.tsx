import React from 'react'
import Image from "next/image";
import Modal from "@/components/modal/Modal";
import {DownloadIcon} from "lucide-react";

type PhotoPreviewModalProps = {
  photo: PostAttachmentInterface
  open: boolean
  closeModal: () => void
}
const PhotoPreviewModal = ({open , closeModal , photo}:PhotoPreviewModalProps) => {
  return (
    <Modal
      className='max-w-none h-screen rounded-none bg-primary/50 backdrop-blur-md dark:bg-muted/50 text-background dark:text-white'
      open={open}
      closeModal={closeModal}
    >
      <div className='w-full flex items-center justify-center h-full p-4 relative'>
        <div className='relative w-full h-full '>
          <Image
            src={photo?.url!}
            className='object-contain '
            alt='preview-img'
            fill
          />

          <a
            onClick={(e) => e.stopPropagation()}
            href={
              process.env.NEXT_PUBLIC_API_URL + '/api/download/' + photo.id
            }
            download
            className='border-none outline-none absolute top-2 z-10 right-2 bg-background rounded-md py-1 px-2 flex items-center gap-2'
          >
            <DownloadIcon className='size-4'/>
            <span className='text-sm'>Download</span>
          </a>
        </div>
      </div>
    </Modal>
  )
}
export default PhotoPreviewModal
