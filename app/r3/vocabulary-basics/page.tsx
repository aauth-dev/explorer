import { ScenarioPage } from "@/components/scenarios/ScenarioPage";
import scenario from "@/lib/scenarios/r3-vocabulary-basics.json";
import { Scenario } from "@/lib/types";

export default function R3VocabularyBasicsPage() {
  return <ScenarioPage scenario={scenario as unknown as Scenario} />;
}
