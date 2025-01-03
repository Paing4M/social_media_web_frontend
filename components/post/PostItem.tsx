'use client'

import UserAvatar from '../avatar/UserAvatar'
import {
  ChevronRight,
  EllipsisVerticalIcon,
  MessageSquareIcon,
  PencilIcon, PinIcon,
  ThumbsUpIcon,
  TrashIcon,
} from 'lucide-react'
import {Button} from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu'
import {formatDate} from '@/lib/utils'
import {useSession} from 'next-auth/react'
import PostAttachments from './PostAttachments'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import PostComment from './PostComment'
import SeeMore from './SeeMore'
import Link from "next/link";

interface PostItemProps {
  post: Post
  handleEdit: (post: Post) => void
  handleDelete: (id: number) => void
  handlePreview: (attachments: PostAttachmentInterface[], idx: number) => void
  handleReaction: (id: number) => void
  currentUserRole?: string | null
  groupId?: number | null
  username?: string | null
  handlePin: (postId: number) => void
}

const PostItem = ({
                    post,
                    handlePin,
                    handleEdit,
                    handleDelete,
                    handlePreview,
                    handleReaction,
                    currentUserRole: role = null,
                    groupId = null,
                    username = null
                  }: PostItemProps) => {
  const session = useSession()


  return (
    <div className='p-4 rounded-lg bg-background shadow-sm border'>
      <div className='flex items-center justify-between'>
        <div className='flex items-start gap-3'>
          <Link href={`/profile/${post?.user?.username}`}>
            <UserAvatar
              name={post?.user?.username!}
              src={post?.user?.avatar_url!}
            />
          </Link>

          <div>
            <div className='flex items-center gap-2'>
              <Link href={`/profile/${post?.user?.username}`} className='text-[16px] font-semibold tracking-wide '>
                {post?.user?.name}
              </Link>
              {post?.group?.id && (
                <>
                  <ChevronRight className='w-4 h-4'/>
                  <Link href={`/group/${post?.group?.slug}`}
                        className='font-semibold hover:underline text-[.9rem]'>{`${post?.group?.name}`}</Link>
                </>
              )}
            </div>
            <p className='text-muted-foreground text-xs leading-4'>
              {formatDate(post?.created_at!)}
            </p>
          </div>
        </div>

        {(role == 'admin' || post?.user.id == session?.data?.user.id) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex items-center gap-2'>
                {username && groupId && post.pin_created_at &&
                  <PinIcon className={'w-5'}/>
                }
                <button className='border-none outline-none'>
                  <EllipsisVerticalIcon className='size-5'/>
                </button>
              </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent>

              {(username || groupId) && (
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => handlePin(post?.id)}
                    className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'
                  >
                    <PinIcon className='size-4 rotate-[45deg]'/>
                    {post.pin_created_at ? 'UnPin' : 'Pin'}
                  </button>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <button
                  onClick={() => handleEdit(post)}
                  className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'
                >
                  <PencilIcon className='size-4'/>
                  Edit
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button
                  onClick={() => handleDelete(post?.id)}
                  className='flex items-center border-none outline-none gap-2 w-full cursor-pointer'
                >
                  <TrashIcon className='size-4'/>
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {post?.body && <SeeMore text={post?.body} className='mt-2'/>}

      {post.attachments && (
        <PostAttachments
          handlePreview={handlePreview}
          attachments={post?.attachments!}
        />
      )}

      <Accordion type='single' collapsible>
        <AccordionItem value='comments'>
          <div className='mt-4 grid grid-cols-2 gap-4 py-2'>
            <Button
              onClick={() => handleReaction(post.id)}
              variant={'secondary'}
              className={`flex items-center gap-2 w-full justify-center bg-secondary  transition ${
                post.reacted_by_user
                  ? 'bg-muted-foreground text-white hover:bg-muted-foreground'
                  : ''
              }`}
            >
              <ThumbsUpIcon className='size-5'/>
              {post.reaction_count > 0 && (
                <span className='inline-block mr-1'>
									( {post.reaction_count} )
								</span>
              )}
              {post.reacted_by_user ? 'Liked' : 'Like'}
            </Button>

            <AccordionTrigger asChild>
              <Button
                variant={'secondary'}
                className={`flex items-center gap-2 w-full justify-center py-2  bg-secondary  transition data-[state='open']:bg-muted-foreground data-[state='open']:text-white`}
              >
                <MessageSquareIcon className='size-5'/>
                {post.comment_count > 0 && (
                  <span className='inline-block mr-1'>
										( {post.comment_count} )
									</span>
                )}
                Comment
              </Button>
            </AccordionTrigger>
          </div>

          <AccordionContent
            className='data-[state=open]:animate-accordion-down
            data-[state=closed]:animate-accordion-up '
          >
            <PostComment post={post} groupId={groupId} username={username}/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default PostItem
