import { useState, FormEvent, ChangeEvent } from "react";
import { Send, CheckCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";
// Types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}


const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Prescription Refill",
  "Appointment Booking",
  "Travel Health",
  "Medication Information",
  "Other",
] as const;

// Validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!validatePhone(formData.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!formData.subject) {
    errors.subject = "Please select a subject";
  }

  if (!formData.message.trim()) {
    errors.message = "Message is required";
  } else if (formData.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
};


const InputField = ({
  label,
  name,
  type = "text",
  value,
  error,
  required = true,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0E2A47] focus:border-transparent transition-all ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  error,
  required = true,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0E2A47] focus:border-transparent transition-all ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    >
      <option value="">Select a subject</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  error,
  required = true,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0E2A47] focus:border-transparent transition-all resize-none ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);

// Main Component
const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData);
      
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-left  mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold  mb-4 text-[#0E2A47]">
            Get in Touch
          </h2>
          <p className="text-xl sm:text-2xl  text-gray-600  ">
            Have questions about our services? We are here to help. Send us a message and we will respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image and Contact Info */}
          <div className="space-y-6">
            {/* Image */}
            <div className=" rounded-2xl w-full  overflow-hidden shadow-lg">
              <Image
                src="/website/contact.png"
                alt="Kings Care Medical Clinic contact "
                className="w-full cover"
                priority
                width={600}
                height={600}
              />
            </div>


           
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Message Sent!</h4>
                  <p className="text-sm text-green-700">
                    Thank you for contacting us. We@apos;ll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  error={errors.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  error={errors.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>

              {/* Email */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
              />

              {/* Phone */}
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                error={errors.phone}
                onChange={handleChange}
                placeholder="(403) 555-0000"
              />

              {/* Subject */}
              <SelectField
                label="Subject"
                name="subject"
                value={formData.subject}
                error={errors.subject}
                onChange={handleChange}
                options={SUBJECT_OPTIONS}
              />

              {/* Message */}
              <TextAreaField
                label="Message"
                name="message"
                value={formData.message}
                error={errors.message}
                onChange={handleChange}
                placeholder="Please tell us how we can help you..."
                rows={6}
              />

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#0E2A47] to-[#4B5563] text-white font-bold text-lg py-4 px-6 rounded-xl hover:from-[#4B5563] hover:to-[#0E2A47] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
