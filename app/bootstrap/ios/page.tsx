import { ScenarioPage } from "@/components/scenarios/ScenarioPage";
import data from "@/lib/scenarios/bootstrap-ios.json";
import { Scenario } from "@/lib/types";
import { BootstrapDeprecationBanner } from "../_components/BootstrapDeprecationBanner";
export default function Page() {
  return (
    <>
      <BootstrapDeprecationBanner />
      <ScenarioPage scenario={data as unknown as Scenario} />
    </>
  );
}
