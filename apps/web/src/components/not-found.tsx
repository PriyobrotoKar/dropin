import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@dropin/ui/components/empty";
import { InputGroupAddon } from "@dropin/ui/components/input-group";
import { Kbd } from "@dropin/ui/components/kbd";
import { IconSearch } from "@tabler/icons-react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@dropin/ui/components/combobox";

const hiddenRoutes: string = "\\/login\\/*";

export function NotFound() {
  const { routesByPath } = useRouter();
  const navigate = useNavigate();

  const routes = Object.keys(routesByPath)
    .map((r) => ({
      label: r.slice(r.lastIndexOf("/") + 1),
      value: r,
    }))
    .filter((r) => r.label.length > 0 && !r.value.match(hiddenRoutes));

  return (
    <Empty className="min-h-svh">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Combobox
          autoHighlight
          items={routes}
          onValueChange={(val: (typeof routes)[number] | null) =>
            val &&
            navigate({
              to: val.value,
            })
          }
        >
          <ComboboxInput
            showTrigger={false}
            placeholder="Try searching for pages..."
          >
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </ComboboxInput>
          <ComboboxContent alignOffset={-28} className="w-60">
            <ComboboxEmpty>No timezones found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  className={"capitalize"}
                  key={item.value}
                  value={item}
                >
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <EmptyDescription>
          <Link to="/">Go to homepage</Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}
