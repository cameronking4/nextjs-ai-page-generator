'use client';

import { useEffect, useState } from 'react';
import { Preview } from '@/components/Preview';
import { EditorChat } from '@/components/EditorChat';
import { Project, Sidebar } from '@/components/Sidebar';
import { transform } from '@babel/standalone';
import { useRouter, useSearchParams } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const App = () => {
  const [code, setCode] = useState<string | undefined>('');
  const [preview, setPreview] = useState<string | null>(null);
  const [projects] = useLocalStorage<Project[]>('projects', []);
  const searchParams = useSearchParams();
  const project = searchParams.get('project');
  const router = useRouter();

  const runCode = (code: string | undefined) => {
    setCode(code);

    try {
      // const transformed = transform(code ?? '', { presets: ['react'] }).code;
      // console.log(transformed)
      setPreview(code ?? null);
    } catch (err) {
      setPreview(`Error: ${err}`);
    }
  };

  useEffect(() => {
    if (!project && projects?.length) {
      router.push(`?project=${projects[0].id}`)
    }
  }, [projects, project, router]);

  return (
    <div className="flex h-screen max-w-full bg-black overflow-y-scroll ">
      {project && (
          <>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40}><EditorChat code={code ?? ''} setCode={runCode}/></ResizablePanel>
          <ResizableHandle withHandle className='text-white'/>
          <ResizablePanel defaultSize={60}><Preview code={preview} /></ResizablePanel>
        </ResizablePanelGroup>
         </>
        )}
    </div>
  );
};

export default App;
