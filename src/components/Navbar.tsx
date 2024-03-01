'use client'
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusIcon } from '@/components/icons/PlusIcon';
import useLocalStorage from '@/hooks/useLocalStorage';
import { storeProject } from '@/actions/chat';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "./ui/button";

export type Project = {
    id: string;
};

export default function NavbarComponent() {

    const searchParams = useSearchParams();
    const currentProject = searchParams.get('project');
    const router = useRouter();
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  
    const createNewProject = async () => {
      const uuid = uuidv4();
      await storeProject(uuid);
      setProjects([...projects ?? [], { id: uuid }]);
      router.push(`?project=${uuid}`);
    }
  
    useEffect(() => {
      if (projects?.length === 0) createNewProject();
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects?.length]);

    return (
        <header className="sticky top-0 z-50 flex flex-wrap sm:justify-start sm:flex-nowrap w-full">
            <nav className="max-w-full w-full mx-auto sm:flex sm:items-center sm:justify-between" aria-label="Global">
                <div className="flex items-center justify-between w-full mb-3">
                    <div className="items-center">
                        <a className="flex-none text-xl ml-1 py-4 text-white" href="/">Nextjs Page Generator </a>
                        {/* <p className="flex-none text-sm ml-1 pt-1 text-gray-500">Generate UI for your page.tsx using Tailwindcss + Shadcn</p> */}
                        <p className="flex-none text-sm ml-1 pt-1 text-gray-500">Generate UI for your page.js (Next app page)</p>
                    </div>
                    <div className="flex items-center">
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <a className="font-medium text-white w-full mr-4" href="#" aria-current="page">Chat history</a>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="overflow-y-scroll">
                            {projects?.map((project) => (
                                <button
                                    key={project.id}
                                    className={`hover:bg-gray-500 transition-colors px-4 py-3 w-full flex gap-3 items-center ${project.id === currentProject ? 'bg-violet-400' : 'bg-[#222] transition-colors hover:bg-violet-700 px-4 py-3 w-full flex gap-3 items-center shadow-lg shadow-violet-900/10 text-white'}`}
                                    onClick={() => router.push(`?project=${project.id}`)}
                                >
                                    <div className="w-2 mr-3">
                                    <ChatIcon />
                                    </div>
                                    <span className={`truncate ${project.id === currentProject ? 'text-black' : 'text-white'}`} key={project.id}>{project.id}</span>
                                </button>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                        <Button onClick={createNewProject} className="bg-violet-900 transition-colors hover:bg-violet-700 rounded-xl px-3 py-4 w-full flex gap-3 items-center shadow-lg shadow-violet-900/10 text-white">
                            <PlusIcon />
                            <span>New Project</span>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );



}
