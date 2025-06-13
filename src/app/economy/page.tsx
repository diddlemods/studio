import PageHeader from '@/components/PageHeader';
import MarketDisplay from '@/components/economy/MarketDisplay';

export default function EconomyPage() {
  return (
    <div>
      <PageHeader
        title="Player-Driven Economy"
        description="Engage with a dynamic market where supply, demand, and player actions shape the economy."
      />
      <MarketDisplay />
    </div>
  );
}
