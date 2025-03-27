import { kunMoyuMoe } from '~/config/moyu-moe'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Avatar } from '@nextui-org/avatar'
import { Chip } from '@nextui-org/chip'
import { Divider } from '@nextui-org/divider'
import { Progress } from '@nextui-org/progress'
import { formatDistanceToNow } from '~/utils/formatDistanceToNow'
import { Calendar, Link as LinkIcon } from 'lucide-react'
import { UserFollow } from './follow/Follow'
import { Stats } from './follow/Stats'
import { SelfButton } from './SelfButton'
import { USER_ROLE_MAP } from '~/constants/user'
import type { UserInfo } from '~/types/api/user'

export const UserProfile = ({ user }: { user: UserInfo }) => {
  return (
    <div className="lg:col-span-1">
      <Card className="w-full">
        <CardHeader className="justify-center pt-8">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              src={user.avatar.replace('-mini', '')}
              className="w-32 h-32"
              isBordered
              color="primary"
            />
            <div className="flex flex-col items-center gap-1">
              <h4 className="text-2xl font-bold">{user.name}</h4>
              <Chip color="primary" variant="flat" size="sm" className="mt-1">
                {USER_ROLE_MAP[user.role]}
              </Chip>

              <Stats user={user} />
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          {user.bio && (
            <p className="mb-6 text-center text-default-600">{user.bio}</p>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="size-4 text-default-400" />
              <a
                href={`${kunMoyuMoe.domain.main}/user/${user.id}`}
                className="text-small text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${kunMoyuMoe.domain.main}/user/${user.id}`}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-default-400" />
              <span className="text-small text-default-500">
                加入于 {formatDistanceToNow(user.registerTime)}
              </span>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-small">萌萌点</span>
                <span className="text-small text-default-500">
                  {user.moemoepoint}
                </span>
              </div>
              <Progress
                aria-label="萌萌点"
                value={user.moemoepoint % 100}
                color="primary"
                className="h-2"
              />
            </div>

            <div className="flex gap-2">
              {user.id === user.requestUserUid ? (
                <SelfButton user={user} />
              ) : (
                <UserFollow
                  uid={user.id}
                  name={user.name}
                  follow={user.isFollow}
                />
              )}

              {/* TODO: */}
              {/* <Button
                startContent={<Mail className="w-4 h-4" />}
                color="default"
                variant="flat"
                fullWidth
              >
                Message
              </Button> */}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
