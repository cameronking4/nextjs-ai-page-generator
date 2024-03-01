import { FC, useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { EditorSection } from '@/components/EditorSection';
import { useSearchParams } from 'next/navigation';
import { getChatMessages, storeChatMessages } from '@/actions/chat';
import { SendIcon } from '@/components/icons/SendIcon';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ChatHistory } from './ChatHistory';
import NavbarComponent from './Navbar';

const basePrompt = `I want you to act like a code generator and only return JSX code, nothing else. Can you please provide me with a React function component for a NextJS page? The component should be named "Page". Remember, I am specifically interested in the actual code implementation (a React function component), no description (this also applies for any improving of the component or approach to implementing). 
For styling you can use inline TailwindCSS, as you can assume that the styles are present.

GUIDANCE:
- Use this documentation if you ever want to use icons: https://lucide.dev/guide/packages/lucide-react
- The sandbox only has lucide-react icons, no other framework.
It's critical you include import statements and relevant/accurate dependencies

RULES:
- Never say a task is too complex, implement the simplest version or MVP
- Never reply with your thoughts or summary, only respond with the code itself

EXAMPLE RESPONSE:
import { Home } from 'lucide-react';
export default function Page({ data })
{
  return (
    <div className="flex shadow-xl">
      <Home size={18} />
      <h1 className="text-lg">Hello {data}</h1>
    </div>
  );
}
  
export function getServerSideProps() {
  return {
    props: { data: "world" },
  }
}
`;

const disallowed = [
  '```',
  '```jsx',
  '```js'
];

const removeDisallowedLines = (input: string) => {
  return input
    .split('\n')
    .filter(line => !disallowed.some(disallowedLine => line.trim().startsWith(disallowedLine)))
    .join('\n');
};

const formatResponse = (input: string) => {
  return removeDisallowedLines(input);
};

type EditorChatProps = {
  setCode: (code: string | undefined) => void;
  code: string;
};

const initialMessages = [
  { id: 'code', role: 'system' as const, content: basePrompt }
];

export const EditorChat: FC<EditorChatProps> = ({ code, setCode }) => {
  const { messages, setMessages, handleSubmit, setInput, input, isLoading } = useChat({ initialMessages });

  const [codeFinished, setCodeFinished] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const currentProject = searchParams.get('project');

  const fetchAndSetChatHistory = async (projectId: string) => {
    const storedMessages = (await getChatMessages(projectId))
      .map((message) => ({ id: message.id, content: message.content, role: message.role as any }));

    setMessages([...initialMessages, ...storedMessages]);
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!currentProject) return;
    fetchAndSetChatHistory(currentProject);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject]);

  useEffect(() => {
    if (codeFinished && currentProject) {
      const messagesToStore = messages.filter((message) => message.role !== 'system' && !!message.id);
      storeChatMessages(currentProject, messagesToStore);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, codeFinished]);

  useEffect(() => {
    setCodeFinished(false);
    const lastBotResponse = messages.filter((message) => message.role === 'assistant').pop();
    setCode(formatResponse(lastBotResponse?.content ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (!codeFinished && !isLoading) {
      setCodeFinished(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div
      className="w-full mr-6 h-full flex flex-col overflow-hidden border-b-black bg-[#222222]">
      <div className="p-4 border-b border-b-gray-700">
        <NavbarComponent/>
        <ChatHistory/>
      </div>
      <div className="h-1/2 flex flex-col bg-violet-300 p-4">
        <EditorSection code={code} onChange={setCode}/>
      </div>
      <div className="p-4 max-h-[90%] h-full flex flex-col justify-between">
        <div className="flex flex-col max-h-[calc(100%-80px)] mb-4 overflow-y-auto">
          <p className="text-white mb-2">Chat History</p>
          <div className="overflow-y-auto overflow-x-hidden" ref={chatHistoryRef}>
            {messages.filter((message) => message.role === 'user').map((message) => (
              <div
                className="flex flex-col mb-2 bg-violet-900 p-2 rounded-xl rounded-tl-none"
                key={message.id}
              >
                <p className="text-white">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
        <form className="flex w-full relative" onSubmit={handleSubmit}>
        <div className="flex grow w-full items-center space-x-2">
          <Input className="p-4 pr-10 text-gray-100 bg-[#222222] rounded-xl border shadow-md transition-colors shadow-violet-500 focus:ring-0 focus:outline-none focus:border-gray-600" type="text" placeholder="A two player connect 4 game."
           value={input}
           disabled={isLoading}
           onChange={(e) => setInput(e.target.value)} />
            <Button className={`text-white bg-violet-900 transition-colors hover:bg-violet-700 rounded-xl px-4 py-3 w-20 flex items-center justify-center shadow-md shadow-violet-900/10 ${isLoading && 'opacity-20 cursor-not-allowed'}`}
            type="submit"
            onClick={(e) => {
              if (isLoading) e.preventDefault();
            }}><SendIcon/></Button>
        </div>
        </form>
      </div>
    </div>
  );
};
