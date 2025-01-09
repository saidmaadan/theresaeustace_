import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface ContactEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactEmail({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-5">
            <Heading className="text-2xl font-bold text-gray-900">
              New Contact Form Submission
            </Heading>
            <Section className="mt-6">
              <Text className="text-gray-700">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="text-gray-700">
                <strong>Email:</strong> {email}
              </Text>
              <Text className="text-gray-700">
                <strong>Subject:</strong> {subject}
              </Text>
              <Hr className="my-4" />
              <Text className="text-gray-700">
                <strong>Message:</strong>
              </Text>
              <Text className="text-gray-700 whitespace-pre-wrap">{message}</Text>
            </Section>
            <Hr className="my-4" />
            <Text className="text-sm text-gray-500">
              This email was sent from the contact form on your website.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
