import type { SVGProps } from "react";

export function GaragePilotIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M12 12h8" />
            <path d="M12 16h4" />
            <path d="m8 8-2 2 2 2" />
            <path d="m16 8 2 2-2 2" />
            <path d="M12 20a4 4 0 0 1-8 0" />
            <path d="M12 20a4 4 0 0 0 8 0" />
        </svg>
    );
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M14 22h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" />
        <path d="M8 6h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
        <path d="M8 18h.01" />
    </svg>
  );
}
