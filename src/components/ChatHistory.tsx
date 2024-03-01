"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusIcon } from '@/components/icons/PlusIcon';
import useLocalStorage from '@/hooks/useLocalStorage';
import { storeProject } from '@/actions/chat';
import { v4 as uuidv4 } from 'uuid';
import { ChatIcon } from '@/components/icons/ChatIcon';
import { useEffect } from 'react';
import Link from "next/link";

export type Project = {
    id: string;
};

export function ChatHistory() {
  const searchParams = useSearchParams();
  const currentProject = searchParams.get('project');
  const router = useRouter();
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const reverseProjects = projects?.slice().reverse();

  const createNewProject = async () => {
    const uuid = uuidv4();
    await storeProject(uuid);
    setProjects([...projects ?? [], { id: uuid }]);
    router.push(`?project=${uuid}`);
  }

  useEffect(() => {
    if (projects?.length === 0) console.log("NO PROJECTS FOUND");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects?.length]);

  return (
    <div className="text-white bg-[#222222]">
      <div className="flex">
      <Select>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder={"Browse chat history"}>
            </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#222222] text-white">
          <SelectGroup>
            {reverseProjects?.map((project) => (
                <div
                    key={project.id}
                    className={`hover:bg-gray-500 transition-colors px-4 py-3 w-full flex gap-3 items-center ${project.id === currentProject ? 'bg-violet-400' : 'bg-[#222] transition-colors hover:bg-violet-700 px-4 py-3 w-full flex gap-3 items-center shadow-lg shadow-violet-900/10 text-white'}`}
                >
                    <Link as = {`/?project=${project.id}`} href={`/?project=${project.id}`} className={`truncate ${project.id === currentProject ? 'text-violet-600' : 'text-white'}`} key={project.id}>{project.id}</Link>
                </div>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      </div>
    </div>
    )
}
