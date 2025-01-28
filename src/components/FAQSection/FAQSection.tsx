import Image from "next/image";
import FaqContainer from "./FaqContainer";

function FAQSection() {
  return (
    <section className="container h-auto relative py-[80px]">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[28px]">
        {/* Left Image Section */}
        <div className="md:w-full  lg:w-[470px] lg:h-[600px] hidden md:block">
          <Image
            src="/assets/img/faq-Image.png"
            width={570}
            height={600}
            alt="Decorative background"
            className="rounded-lg object-cover md:w-full lg:w-[570px] md:h-[600px] lg:h-auto"
          />
        </div>

        {/* Right Content Section */}
        <div className="md:w-full lg:w-3/5">
          <div className="text-center lg:text-left">
            <h1 className="text-[25px] md:text-[32px] lg:text-[32px] font-semibold text-gradient py-2">
              What do you want to know?
            </h1>
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#444444] leading-6 mb-10">
              Connect with Trusted Sellers, Explore Quality Products, and
              Elevate Your Experience.
            </p>
          </div>

          {/* Accordion Section */}
          <FaqContainer />
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
