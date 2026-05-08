import { ScenarioPage } from "@/components/scenarios/ScenarioPage";
import scenario from "@/lib/scenarios/r3-conditional-ops.json";
import { Scenario } from "@/lib/types";

export default function R3ConditionalOpsPage() {
  return <ScenarioPage scenario={scenario as unknown as Scenario} />;
}
