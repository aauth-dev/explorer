import { ScenarioPage } from "@/components/scenarios/ScenarioPage";
import scenario from "@/lib/scenarios/r3-content-addressing.json";
import { Scenario } from "@/lib/types";

export default function R3ContentAddressingPage() {
  return <ScenarioPage scenario={scenario as unknown as Scenario} />;
}
