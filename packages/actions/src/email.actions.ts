"use server";

import sgMail from "@sendgrid/mail";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Generic email sending function.
 * Currently implemented using SendGrid, but designed to be adaptable.
 */
export const sendEmail = async (options: SendEmailOptions) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const defaultFrom = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey) {
    console.error("SENDGRID_API_KEY is not defined");
    throw new Error("Email service not configured");
  }

  if (!options.from && !defaultFrom) {
    console.error(
      "SENDGRID_FROM_EMAIL is not defined and no from address provided"
    );
    throw new Error("Email sender address not configured");
  }

  sgMail.setApiKey(apiKey);

  const msg = {
    to: options.to,
    from: options.from || defaultFrom!, // defaultFrom is checked above
    subject: options.subject,
    text: options.text || options.html.replace(/<[^>]*>?/gm, ""), // Fallback text generation
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${options.to}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { success: false, error: error.message };
  }
};
