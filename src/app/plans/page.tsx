import PricingPlan from "~/app/_components/plans/pricing-plan";

export default function Plans() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20 bg-gradient-to-b from-[white] to-[#f7faff] py-12 text-black">
      <PricingPlan />
    </div>
  );
}
