import { useRouter, useSearchParams } from 'next/navigation';
import { PlusIcon } from '@/components/icons/PlusIcon';
import useLocalStorage from '@/hooks/useLocalStorage';
import { storeProject } from '@/actions/chat';
import { v4 as uuidv4 } from 'uuid';
import { ChatIcon } from '@/components/icons/ChatIcon';
import { useEffect } from 'react';

export type Project = {
  id: string;
};

export const Sidebar = () => {
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
    <div className='max-w-[200px] py-2 px-2'>
      <button className="bg-violet-900 transition-colors hover:bg-violet-700 rounded-xl px-4 py-3 w-full flex gap-3 items-center shadow-lg shadow-violet-900/10 text-white" onClick={createNewProject}>
        <PlusIcon />
        <span>New Project</span>
      </button>
      <div className="mt-6 space-y-3">
        {projects?.map((project) => (
          <button
            key={project.id}
            className={`rounded-xl hover:bg-gray-500 transition-colors px-4 py-3 w-full flex gap-3 items-center ${project.id === currentProject ? 'bg-violet-400' : 'bg-[#222] transition-colors hover:bg-violet-700 rounded-xl px-4 py-3 w-full flex gap-3 items-center shadow-lg shadow-violet-900/10 text-white'}`}
            onClick={() => router.push(`?project=${project.id}`)}
          >
            <div className="w-2 mr-3">
              <ChatIcon />
            </div>
            <span className={`truncate ${project.id === currentProject ? 'text-black' : 'text-white'}`} key={project.id}>{project.id}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
