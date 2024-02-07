import { Message as MessageType } from '@/@types'


type MessageProps = {message: MessageType}
function Message({message}: MessageProps) {
  return (
    <div className='box-border mb-1 ml-1 text-black font-normal font-sans flex flex-row p-0 bg-transparent overflow-hidden rounded-none'>
      <div className='text-black bg-blue-200 p-[.4rem] flex flex-col' style={{ borderRadius: '0 0.7em 0.7em 0' }}>
        <div className=' flex flex-row gap-2'>
        <img className='rounded-full border-[1px] border-[white] w-[30px] h-[30px]' src={message.sender.userInfo.photoURL ?? ""} alt={'No photo'} />
          <div className='flex flex-col items-start'>
        <span className='text-[.75rem]  mr-4 text-black font-bold' >
          {message.sender.userInfo.nickname} 
          </span>
          <p>{message.content}</p>
          </div>
          <div className='text-[0.5rem] text-gray-500' >
          {new Date(message.time).toLocaleString().slice(0, -3)}
          </div>
        </div>
          
      </div>
    </div>
  )
}

export default Message