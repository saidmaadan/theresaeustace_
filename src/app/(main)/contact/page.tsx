import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {
  return (
    <div className="container-center py-20 mt-20">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Get in Touch
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Have a question or want to collaborate? Send me a message and I&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
