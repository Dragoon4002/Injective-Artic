import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GitBranch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="h-screen">
      <div className="relative isolate h-full w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/footer-night.png"
            alt=""
            fill
            className="object-cover object-center"
            priority={false}
          />
        </div>

        <div className="relative flex h-full flex-col justify-center px-6 py-20 text-center md:px-16 md:py-28">
          <p className="mb-5 text-xs uppercase tracking-[1.5px] text-gray">
            Get started
          </p>
          <h2 className="mx-auto mb-5 max-w-5xl text-[clamp(40px,7vw,96px)] font-bold leading-[1.05] tracking-tight text-foreground">
            Spin up your first agent.
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-[17px] leading-relaxed text-foreground/60">
            Connect a wallet, pick a symbol, let the desk trade. Self-host from
            GitHub when you want full control.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/connect"
              className={cn(
                buttonVariants(),
                "rounded-2xl text-foreground border border-cta-border bg-linear-to-b from-cta-light! to-cta! hover:from-cta! hover:to-cta-hover! px-7 h-12 text-[15px] font-semibold gap-2 transition-colors"
              )}
            >
              Launch app <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/Dragoon4002/artic-trader"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5 rounded-full px-7 h-12 text-[15px] font-semibold bg-white/[0.04] backdrop-blur-sm gap-2"
              )}
            >
              <GitBranch className="h-4 w-4" /> View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
