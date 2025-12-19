import { Box, Card, Flex, Text, Badge, Link } from "@radix-ui/themes";
import { EXPLORER_URL } from "../constants";

interface HeroFields {
  id: { id: string };
  name: string;
  stamina: string;
  weapon?: {
    fields?: {
      id: { id: string };
      name: string;
      attack: string;
    };
  };
}

interface HeroCardProps {
  fields: HeroFields;
}

export function HeroCard({ fields }: HeroCardProps) {
  const heroId = fields.id.id;
  const weapon = fields.weapon?.fields;

  return (
    <Card style={{ marginBottom: "12px" }}>
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <Text size="5" weight="bold">
            {fields.name}
          </Text>
          <Badge color="green">Stamina: {fields.stamina}</Badge>
        </Flex>

        <Text size="2" color="gray">
          ID:{" "}
          <Link
            href={`${EXPLORER_URL}/object/${heroId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {heroId.slice(0, 8)}...{heroId.slice(-6)}
          </Link>
        </Text>

        {weapon && (
          <Box
            style={{
              padding: "8px",
              background: "var(--gray-a3)",
              borderRadius: "6px",
            }}
          >
            <Text size="2" weight="bold">
              ⚔️ Equipped Weapon: {weapon.name}
            </Text>
            <Flex gap="2" mt="1">
              <Badge color="red">Attack: {weapon.attack}</Badge>
              <Text size="1" color="gray">
                ID: {weapon.id.id.slice(0, 8)}...
              </Text>
            </Flex>
          </Box>
        )}

        {!weapon && (
          <Text size="2" color="gray" style={{ fontStyle: "italic" }}>
            No weapon equipped
          </Text>
        )}
      </Flex>
    </Card>
  );
}
