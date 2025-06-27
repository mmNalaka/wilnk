import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Verified, Instagram, Github, Linkedin } from "lucide-react";
import Link from "next/link";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Params) {
  const { slug } = await params;

  return (
    <div className="bg-amber-50">
      <div className="mx-auto flex h-screen w-lg flex-col">
        <div className="mt-10 flex grow flex-col items-center">
          <div className="flex flex-col gap-2">
            <Avatar className="size-24">
              <AvatarImage src="https://avatars.githubusercontent.com/u/18021829?v=4" />
              <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-2xl">
              @{slug} <Verified fill="#256edb" className="inline text-white" />
            </h1>
          </div>

          <div className="mt-6">
            <p className="text-center font-medium text-lg">
              Explore some of the best link-in-bio pages created by the Linky
              community.
            </p>
          </div>

          <div className="mt-10 flex w-full flex-col gap-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
              size="lg"
              variant="default"
            >
              <Link
                href={`https://instagram.com/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Instagram size={20} />
                Follow on Instagram
              </Link>
            </Button>

            {/* Github Link */}
            <Button
              asChild
              className="w-full bg-[#24292e] text-white hover:bg-[#2b3137]"
              size="lg"
              variant="default"
            >
              <Link
                href={`https://github.com/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github size={20} />
                Follow on GitHub
              </Link>
            </Button>

            {/* LinkedIn Link */}
            <Button
              asChild
              className="w-full bg-[#0077b5] text-white hover:bg-[#006699]"
              size="lg"
              variant="default"
            >
              <Link
                href={`https://linkedin.com/in/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Linkedin size={20} />
                Connect on LinkedIn
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-10">
          <p className="pb-2 text-center text-muted-foreground text-sm">
            Powered by <span className="font-bold">Wilnk</span>
          </p>
        </div>
      </div>
    </div>
  );
}
