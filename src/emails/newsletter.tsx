import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface NewsletterEmailProps {
  previewText: string;
  content: string;
}

export default function NewsletterEmail({
  previewText,
  content,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-5">
            <Section className="mt-6">
              <Heading className="text-2xl font-bold text-gray-900">
                Theresa Eustace
              </Heading>
            </Section>
            <Section className="mt-6">
              <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Section>
            <Section className="mt-8 text-center">
              <Text className="text-gray-500 text-xs">
                © {new Date().getFullYear()} Theresa Eustace. All rights reserved.
                <br />
                If you no longer wish to receive these emails, you can{" "}
                <a
                  href="{{unsubscribeUrl}}"
                  className="text-green-500 underline"
                >
                  unsubscribe here
                </a>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
