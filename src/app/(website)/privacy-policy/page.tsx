/* eslint-disable react/no-unescaped-entities */
"use client"

import { PageHeader } from "@/components/shared/sections/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { downloadPrivacyAsPDF } from "@/lib/PrivacyPolicy";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, FileDown } from "lucide-react";
import { useRef, useState } from "react";

function Page() {
  const contentRef = useRef<HTMLDivElement>(null)
    const [expandAll, setExpandAll] = useState(false)
  const [value, setValue] = useState<string[]>([])

  const handleExpandAll = () => {
    if (expandAll) {
      setValue([])
    } else {
      setValue(["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7", "item-8", "item-9"])
    }
    setExpandAll(!expandAll)
  }
  return (
    <section>
      <PageHeader
        title="Privacy Policy"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Privacy Policy",
            href: "/privacy-policy",
          },
        ]}
      />
      <div className="container section">
        {/* <div className="text-center">
          <SectionHeading heading={"Privacy Policy"} subheading={""} />
        </div> */}

        <div ref={contentRef}>
          <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground  dark:bg-pinkGradient">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center text-white">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Protecting your private information is our priority. This Statement of Privacy applies to
              www.pacifirimfusion.com and PACIFIC RIM FUSION and governs data collection and usage. For the purposes of
              this Privacy Policy, unless otherwise noted, all references to PACIFIC RIM FUSION include
              www.pacificrimfusion.com. The Platform is intended solely for verified and approved licensed cannabis
              vendors operating in jurisdictions where cannabis is legal for recreational or medical use. You represent
              and warrant that you are 21 years old and a licensed cannabis vendor in good standing and authorized to
              conduct cannabis-related business activities in your respective jurisdiction.
            </p>
            <p className="text-muted-foreground mt-4">
              By using the PACIFIC RIM FUSION website, you consent to the data practices described in this statement.
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleExpandAll} className="flex items-center gap-2 bg-primary  dark:bg-pinkGradient">
              {expandAll ? "Collapse All" : "Expand All"}
              <ChevronDown className={`h-4 w-4 transition-transform ${expandAll ? "rotate-180" : ""}`} />
            </Button>
          </div>

          <Accordion type="multiple" value={value} onValueChange={setValue} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-gradient">
                Collection of your Personal Information
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  In order to better provide you with products and services offered on our Site, PACIFIC RIM FUSION may
                  collect personally identifiable information, such as your: First and Last Name, Mailing Address,
                  E-mail Address, Phone Number, and Copy of Government Issued Photo ID.
                </p>
                <p>
                  PACIFIC RIM FUSION may also collect anonymous demographic information, which is not unique to you,
                  such as your: Age and Gender. Please keep in mind that if you directly disclose personally
                  identifiable information or personally sensitive data through PACIFIC RIM FUSION's public message
                  boards, this information may be collected and used by others.
                </p>
                <p>
                  We do not collect any personal information about you unless you voluntarily provide it to us. However,
                  you may be required to provide certain personal information to us when you elect to use certain
                  products or services available on the Site. These may include: (a) registering for an account on our
                  Site; (b) entering a sweepstakes or contest sponsored by us or one of our partners; (c) signing up for
                  special offers from selected third parties; (d) sending us an email message; (e) submitting your
                  credit card or other payment information when ordering and purchasing products and services on our
                  Site. To wit, we will use your information for, but not limited to, communicating with you in relation
                  to services and/or products you have requested from us. We also may gather additional personal or
                  non-personal information in the future.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Use of your Personal Information</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  PACIFIC RIM FUSION collects and uses your personal information to operate its website(s) and deliver
                  the services you have requested. PACIFIC RIM FUSION may also use your personally identifiable
                  information to inform you of other products or services available from PACIFIC RIM FUSION and its
                  affiliates.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-gradient">
                Sharing Information with Third Parties
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  PACIFIC RIM FUSION does not sell, rent or lease its customer lists to third parties. PACIFIC RIM
                  FUSION may share data with trusted partners to help perform statistical analysis, send you email or
                  postal mail, provide customer support, or arrange for deliveries. All such third parties are
                  prohibited from using your personal information except to provide these services to PACIFIC RIM
                  FUSION, and they are required to maintain the confidentiality of your information. We use your
                  business license information to also verify your eligibility.
                </p>
                <p>
                  PACIFIC RIM FUSION may disclose your personal information, without notice, if required to do so by law
                  or in the good faith belief that such action is necessary to: (a) conform to the edicts of the law or
                  comply with legal process served on PACIFIC RIM FUSION or the site; (b) protect and defend the rights
                  or property of PACIFIC RIM FUSION; and/or (c) act under exigent circumstances to protect the personal
                  safety of users of PACIFIC RIM FUSION, or the public.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Tracking User Behavior</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  PACIFIC RIM FUSION may keep track of the websites and pages our users visit within PACIFIC RIM FUSION,
                  in order to determine what PACIFIC RIM FUSION services are the most popular. This data is used to
                  deliver customized content and advertising within PACIFIC RIM FUSION to customers whose behavior
                  indicates that they are interested in a particular subject area.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Automatically Collected Information</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Information about your computer hardware and software may be automatically collected by PACIFIC RIM
                  FUSION. This information can include: your IP address, browser type, domain names, access times and
                  referring website addresses. This information is used for the operation of the service, to maintain
                  quality of the service, and to provide general statistics regarding use of the PACIFIC RIM FUSION
                  website.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Use of Cookies</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  The PACIFIC RIM FUSION website may use "cookies" to help you personalize your online experience. A
                  cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to
                  run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only
                  be read by a web server in the domain that issued the cookie to you.
                </p>
                <p>
                  One of the primary purposes of cookies is to provide a convenience feature to save you time. The
                  purpose of a cookie is to tell the Web server that you have returned to a specific page. For example,
                  if you personalize PACIFIC RIM FUSION pages, or register with PACIFIC RIM FUSION site or services, a
                  cookie helps PACIFIC RIM FUSION to recall your specific information on subsequent visits. This
                  simplifies the process of recording your personal information, such as billing addresses, shipping
                  addresses, and so on. When you return to the same PACIFIC RIM FUSION website, the information you
                  previously provided can be retrieved, so you can easily use the PACIFIC RIM FUSION features that you
                  customized.
                </p>
                <p>
                  You have the ability to accept or decline cookies. Most Web browsers automatically accept cookies, but
                  you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline
                  cookies, you may not be able to fully experience the interactive features of the PACIFIC RIM FUSION
                  services or websites you visit.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Links</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  This website contains links to other sites. Please be aware that we are not responsible for the
                  content or privacy practices of such other sites. We encourage our users to be aware when they leave
                  our site and to read the privacy statements of any other site that collects personally identifiable
                  information.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold text-gradient">
                Security of your Personal Information
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  PACIFIC RIM FUSION secures your personal information from unauthorized access, use, or disclosure.
                  PACIFIC RIM FUSION uses the following methods for this purpose: SSL Protocol. When personal
                  information (such as a credit card number) is transmitted to other websites, it is protected through
                  the use of encryption, such as the Secure Sockets Layer (SSL) protocol.
                </p>
                <p>
                  We strive to take appropriate security measures to protect against unauthorized access to or
                  alteration of your personal information. Unfortunately, no data transmission over the Internet or any
                  wireless network can be guaranteed to be 100% secure. As a result, while we strive to protect your
                  personal information, you acknowledge that: (a) there are security and privacy limitations inherent to
                  the Internet which are beyond our control; and (b) security, integrity, and privacy of any and all
                  information and data exchanged between you and us through this Site cannot be guaranteed.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-semibold text-gradient">GDPR Compliance</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Our company is committed to protecting your personal data in compliance with the General Data
                  Protection Regulation (GDPR). As a B2B Hemp and CBD and Recreational Cannabis wholesale auction and
                  listings website, we collect and process business and personal information necessary for business
                  operations, including company names, business email addresses, and contact details of representatives.
                  We use this data to facilitate transactions, provide our services, and communicate with our users. Our
                  legal basis for processing this information is legitimate interest, as it is essential for conducting
                  our B2B operations. We implement appropriate security measures to safeguard your data and only retain
                  it for as long as necessary to fulfill our business purposes. You have the right to access, rectify,
                  erase, or object to the processing of your personal data. For more information on how we handle your
                  data or to exercise your rights, please contact us.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Right to Deletion</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  Subject to certain exceptions set out below, on receipt of a verifiable request from you, we will:
                  Delete your personal information from our records; and Direct any service providers to delete your
                  personal information from their records.
                </p>
                <p>
                  Please note that we may not be able to comply with requests to delete your personal information if it
                  is necessary to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Complete the transaction for which the personal information was collected, fulfill the terms of a
                    written warranty or product recall conducted in accordance with federal law, provide a good or
                    service requested by you, or reasonably anticipated within the context of our ongoing business
                    relationship with you, or otherwise perform a contract between you and us;
                  </li>
                  <li>
                    Detect security incidents, protect against malicious, deceptive, fraudulent, or illegal activity; or
                    prosecute those responsible for that activity;
                  </li>
                  <li>Debug to identify and repair errors that impair existing intended functionality;</li>
                  <li>
                    Exercise free speech, ensure the right of another consumer to exercise his or her right of free
                    speech, or exercise another right provided for by law in Thailand, Germany, United Kingdom, Spain,
                    Netherlands, Canada and provinces and US and States.;
                  </li>
                  <li>Comply with the Electronic Communications Privacy Act;</li>
                  <li>
                    Engage in public or peer-reviewed scientific, historical, or statistical research in the public
                    interest that adheres to all other applicable ethics and privacy laws, when our deletion of the
                    information is likely to render impossible or seriously impair the achievement of such research,
                    provided we have obtained your informed consent;
                  </li>
                  <li>
                    Enable solely internal uses that are reasonably aligned with your expectations based on your
                    relationship with us;
                  </li>
                  <li>Comply with an existing legal obligation; or</li>
                  <li>
                    Otherwise use your personal information, internally, in a lawful manner that is compatible with the
                    context in which you provided the information.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger className="text-lg font-semibold text-gradient">E-mail Communications</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  From time to time, PACIFIC RIM FUSION may contact you via email for the purpose of providing
                  announcements, promotional offers, alerts, confirmations, surveys, and/or other general communication.
                  In order to improve our Services, we may receive a notification when you open an email from PACIFIC
                  RIM FUSION or click on a link therein. If you would like to stop receiving marketing or promotional
                  communications via email from PACIFIC RIM FUSION, you may opt out of such communications by clicking
                  on the UNSUBSCRIBE button at the bottom of our emails.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12">
              <AccordionTrigger className="text-lg font-semibold text-gradient">External Data Storage Sites</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  We may store your data on servers provided by third party hosting vendors with whom we have
                  contracted.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Changes to this Statement</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  PACIFIC RIM FUSION reserves the right to change this Privacy Policy from time to time. We will notify
                  you about significant changes in the way we treat personal information by sending a notice to the
                  primary email address specified in your account, by placing a prominent notice on our site, and/or by
                  updating any privacy information on this page. Your continued use of the Site and/or Services
                  available through this Site after such modifications will constitute your: (a) acknowledgment of the
                  modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Contact Information</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  PACIFIC RIM FUSION welcomes your questions or comments regarding this Statement of Privacy. If you
                  believe that PACIFIC RIM FUSION has not adhered to this Statement, please contact PACIFIC RIM FUSION
                  at: info@pacificrimfusion.com
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Cookie Policy</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  Cookies and similar technologies such as tags, pixels, web beacons and tracking technologies on mobile
                  apps ("Cookies") are small data files that Pacific Rim Fusion Limited ("we", "us", or "Pacific Rim
                  Fusion") stores on your device, and you have a choice as to which categories of Cookies you allow us
                  to store.
                </p>
                <p>
                  We use Cookies to distinguish you from other users of our website and mobile application (the
                  "Platform"). This helps us to provide you with a good experience when you browse and interact with the
                  Platform and allows us to improve the Platform.
                </p>
                <p>We use the following types of Cookies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium text-foreground">Essential Cookies.</span> These are Cookies that are
                    required for the operation of the Platform and are placed automatically without consent, because the
                    Platform cannot work properly without them. They include, for example, Cookies that enable you to
                    login securely to your account, process payments for investments, and support fraud prevention.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Analytics Cookies.</span> These Cookies allow us to
                    recognise and count the number of visitors and to see how visitors move around the Platform when
                    they are using it. This helps us to improve the way the Platform works, for example, by helping us
                    understand how it is performing so we can make improvements that can improve your experience.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Personalisation Cookies.</span> These Cookies may be
                    used to ensure that all our services and communications are relevant to you. Without these cookies,
                    we cannot remember choices you've previously made or personalise your browsing experience (for
                    example, to remember your email at login, or your settings for viewing the website).
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Marketing Cookies.</span> These Cookies record your
                    visit to the Platform, the parts of it you have visited and the links you have followed. We will use
                    this information to make the Platform more relevant to your interests. We may also share this
                    information with selected third parties for this purpose.
                  </li>
                </ul>
                <p>
                  Please note that third parties may also use Cookies on our Platform. We do not have access to these
                  Cookies and, other than allowing them to be served, we play no role in these Cookies at all. These
                  third parties may include, for example, businesses fundraising on the Platform, advertising networks,
                  and providers of external services like web traffic analysis services. Such third party Cookies are
                  likely to be analytics, personalisation or marketing Cookies.
                </p>
                <p>
                  You can choose which Cookies we can set on our Platform. You can also choose to enable or disable
                  website Cookies in your browser settings. In addition, you may delete Cookies that have already been
                  placed on your device. For further details please consult the help menu in your browser. Note that
                  disabling or deleting Cookies may prevent you from using the full range of services available on the
                  Platform.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By using the Pacific Rim Fusion Platform, you acknowledge that you have read, understood, and agreed to
              this Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: March 17, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
        </div>
  
        <div className="mt-8 flex justify-end">
            <Button
              onClick={() => downloadPrivacyAsPDF(contentRef.current)}
            >
              <FileDown /> Download
            </Button>
        </div>
      </div>
    </section>
  )
}

export default Page