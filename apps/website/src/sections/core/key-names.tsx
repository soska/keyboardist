import { InlineCode, P, Table, Td, Th } from "@/components/prose";

export function KeyNamesSection() {
  return (
    <>
      <P>
        Friendly names are canonical, and raw{" "}
        <InlineCode>event.code</InlineCode> spellings normalize to the same key
        — all of these match the same binding:
      </P>
      <Table>
        <thead>
          <tr>
            <Th>You write</Th>
            <Th>Canonical name</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>
              <InlineCode>a</InlineCode>, <InlineCode>KeyA</InlineCode>,{" "}
              <InlineCode>keya</InlineCode>
            </Td>
            <Td>
              <InlineCode>a</InlineCode>
            </Td>
          </tr>
          <tr>
            <Td>
              <InlineCode>up</InlineCode>, <InlineCode>ArrowUp</InlineCode>
            </Td>
            <Td>
              <InlineCode>up</InlineCode>
            </Td>
          </tr>
          <tr>
            <Td>
              <InlineCode>1</InlineCode>, <InlineCode>Digit1</InlineCode>
            </Td>
            <Td>
              <InlineCode>1</InlineCode> (<InlineCode>numpad1</InlineCode> stays
              distinct)
            </Td>
          </tr>
          <tr>
            <Td>
              <InlineCode>shift+up</InlineCode>,{" "}
              <InlineCode>Shift + ArrowUp</InlineCode>
            </Td>
            <Td>
              <InlineCode>shift+up</InlineCode>
            </Td>
          </tr>
          <tr>
            <Td>
              <InlineCode>cmd+k</InlineCode>, <InlineCode>Meta+K</InlineCode>,{" "}
              <InlineCode>command+k</InlineCode>
            </Td>
            <Td>
              <InlineCode>meta+k</InlineCode>
            </Td>
          </tr>
          <tr>
            <Td>
              <InlineCode>ctrl+shift+p</InlineCode>,{" "}
              <InlineCode>shift+control+p</InlineCode>
            </Td>
            <Td>
              <InlineCode>shift+ctrl+p</InlineCode>
            </Td>
          </tr>
        </tbody>
      </Table>
      <P>
        Case and spaces are ignored; modifiers always normalize to the order
        alt, shift, ctrl, meta. A comma binds one handler to several keys:{" "}
        <InlineCode>subscribe("j,k", fn)</InlineCode> fires for both. If you're
        unsure of a key's name, use the{" "}
        <a
          href="#monitor"
          className="text-zinc-900 underline dark:text-zinc-100"
        >
          monitor
        </a>
        . The normalizer is exported as{" "}
        <InlineCode>normalizeKeyName()</InlineCode> if you need it.
      </P>
    </>
  );
}
