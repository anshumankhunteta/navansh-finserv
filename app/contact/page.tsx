"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Phone } from "lucide-react";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate form submission
    // In production, this would send to your email forwarding service or API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="border-b border-slate-700 bg-slate-800 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-slate-400 sm:text-xl">
            [INSERT CONTACT PAGE INTRO TEXT HERE] Let's discuss how we can help
            protect what matters most to you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Calendar Embed */}
          <div>
            <Card>
              <CardHeader>
                <Calendar className="mb-4 h-8 w-8 text-amber-500" />
                <CardTitle>Schedule a Consultation</CardTitle>
                <CardDescription>
                  Book a time that works for you. We'll discuss your insurance
                  needs and answer any questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-800">
                  <iframe
                    src="https://calendly.com/[INSERT-CALENDLY-USERNAME]/[INSERT-EVENT-TYPE]"
                    title="Schedule a consultation"
                    className="h-full w-full border-0"
                    style={{ minHeight: "400px" }}
                  />
                  <p className="mt-4 text-center text-sm text-slate-400">
                    [INSERT CALENDAR PLACEHOLDER TEXT] Replace with your
                    Calendly or Cal.com embed URL
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <Mail className="mb-4 h-8 w-8 text-amber-500" />
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Have a question? Fill out the form below and we'll get back to
                  you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-300"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your name"
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-300"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-slate-300"
                    >
                      How can we help? *
                    </label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us about your insurance needs..."
                      rows={6}
                      aria-invalid={errors.message ? "true" : "false"}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-400">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {submitSuccess && (
                    <div className="rounded-md bg-green-900/50 p-4 text-sm text-green-300">
                      Thank you! Your message has been sent. We'll get back to
                      you soon.
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="bg-slate-800">
            <CardHeader>
              <Phone className="mb-4 h-8 w-8 text-amber-500" />
              <CardTitle>Phone</CardTitle>
              <CardDescription>
                [INSERT PHONE NUMBER HERE]
                <br />
                [INSERT BUSINESS HOURS HERE]
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800">
            <CardHeader>
              <Mail className="mb-4 h-8 w-8 text-amber-500" />
              <CardTitle>Email</CardTitle>
              <CardDescription>
                [INSERT EMAIL ADDRESS HERE]
                <br />
                [INSERT RESPONSE TIME INFO HERE]
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800">
            <CardHeader>
              <Calendar className="mb-4 h-8 w-8 text-amber-500" />
              <CardTitle>Office Hours</CardTitle>
              <CardDescription>
                [INSERT OFFICE HOURS HERE]
                <br />
                [INSERT TIMEZONE INFO HERE]
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
