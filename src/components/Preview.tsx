"use client";
import { FC, useEffect, useRef } from 'react';
import { Sandpack, SandpackCodeEditor, SandpackConsole, SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from './ui/scroll-area';


function prependUseClientIfNeeded(inputString: string): string {
  // Define the keywords to search for
  const keywords = ["useState", "useEffect", "useRef"];

  // Check if any of the keywords exist in the input string
  const containsHook = keywords.some(keyword => inputString.includes(keyword));

  // Prepend "use client"; to the string if any keyword is found
  if (containsHook) {
    return `"use client;"
${inputString}`;
  }

  // Return the original string if no keywords are found
  return inputString;
}

export const Preview: FC<{ code: string | null }> = ({ code }) => {
  const rawCode = prependUseClientIfNeeded(code|| "");
  console.log(`inserted the following: ${rawCode}`);
  const iframe = useRef<HTMLIFrameElement | null>(null);
  
  const files = {
    //code
    "pages/index.js": rawCode.length > 5 ? rawCode : `import { Home } from 'lucide-react';
    export default function Page({ data })
    {
      return (
        <div className="px-4 py-8">
          <Home size={18} />
          <h1 className="text-lg mt-4">Welcome to Nextjs Page Generator</h1>
          <p className="text-sm text-gray-700">{data}</p>
          <div className="card-inner mt-4 px-12 py-5 shadow-xl"> 
            <h1 className="underline text-gray-700">Example prompts</h1> 
            <p className="text-xs text-gray-500"> Copy and paste an example below </p>
            <ul className="mt-2 py-18">
              <li>Create a connect 4 game for two players. Show alert when game is won.</li>
              <li className="mt-2">Create a single page app with a title and get started button. Get started button should launch modal, a form that asks for a github repo. Use axios to fetch repo contents. On submit, it will fetch and display the repo file structure. Allow user to click and drill into file contents.</li>
              <li className="mt-2">Create a sodoku board game, make it take up the screen size. Allow user to edit empty cells. Validate rows/columns and add a hint button that shows an answer each time.</li>
            </ul>
          </div>
        </div>
      );
    }
  
    export function getServerSideProps() {
      return {
        props: { data: "Use the AI chat assistant to generate your Nextjs page using Tailwindcss" },
      }
    }`,
    // styles.css
    "styles.css":  `/* purgecss start ignore */
    @tailwind base;
    /* purgecss end ignore */
    @tailwind components;
    @tailwind utilities;
    `,
    // tailwind.config.js
    "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    
        // Or if using 'src' directory:
        "./src/**/*.{js,ts,jsx,tsx}"
      ],
      theme: {
        extend: {}
      },
      plugins: []
    }`,
    // postcss.config.js
    "postcss.config.js": `module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    }`,    
  };
  const customSetup = {
    dependencies: {
      "react": "latest",
      "react-dom": "latest",
      "tailwindcss": "latest",
      "postcss-easy-import": "latest",
      "autoprefixer": "latest",
      "postcss": "latest",
      "axios": "latest",
      "lucide-react": "latest",
      "openai": "latest",
      "ai": "latest",
      "react-modal": "latest"
    }
  };

  useEffect(() => {
    if (!iframe.current) return;
  }, [code]);

  return (
    <div className="w-full overflow-hidden bg-[#222222]">
      <h2 className="text-white text-lg p-4 border-b border-gray-700">Preview Sandbox</h2>
      {/* <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        width="100%"
        height="100%"
      /> */}
    <SandpackProvider
      files={files} 
      theme={sandpackDark} 
      template="nextjs"
      customSetup={customSetup}
      options={{ autoReload: true, autorun: true}}
    >
      <SandpackLayout>
        <ResizablePanelGroup className='min-h-screen' direction="vertical">
          <ResizablePanel defaultSize={90}>
            <SandpackPreview className='flex min-h-full grow-0' showRefreshButton={true} showOpenNewtab={true} showNavigator={true} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={10}>
            <ScrollArea>
              <SandpackCodeEditor className='overflow-y-scroll' showLineNumbers={true} showRunButton={true} showTabs wrapContent closableTabs />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SandpackLayout>
    </SandpackProvider>
    </div>
  );
};
