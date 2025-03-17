/* eslint-disable react/no-unescaped-entities */
"use client"


// import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import { PageHeader } from "@/components/shared/sections/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { downloadTermsAsPDF } from "@/lib/TermsAndConditions";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, FileDown } from "lucide-react";
import { useRef, useState} from "react";



const Page = () => {
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
    <>
      <PageHeader
        title="Terms And Condions"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Terms And Condions",
            href: "/term-and-conditions",
          },
        ]}
      />
      <div className="container section">
        {/* <SectionHeading heading="Terms and Conditions" subheading="" /> */}
        <div className="text-[#444444] font-norma space-y-[20px]" ref={contentRef}>
       <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary dark:bg-pinkGradient text-primary-foreground">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center text-white">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-muted-foreground">
              These terms and conditions govern your use of the Pacific Rim Fusion LLC ("Pacific Rim Fusion") online
              marketplace platform (the "Platform"). By accessing or using the Platform, you agree to be bound by these
              terms and conditions. If you do not agree with any part of these terms and conditions, you must not use
              the Platform.
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={handleExpandAll} className="flex items-center gap-2 bg-primary dark:bg-pinkGradient">
              {expandAll ? "Collapse All" : "Expand All"}
              <ChevronDown className={`h-4 w-4 transition-transform ${expandAll ? "rotate-180" : ""}`} />
            </Button>
          </div>

          <Accordion type="multiple" value={value} onValueChange={setValue} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Eligibility</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <p>
                  The Platform is intended solely for verified and approved licensed hemp / cbd and cannabis vendors
                  operating in jurisdictions where hemp / cbd (retail) and cannabis(recreational) is legal for
                  recreational or medical use. You represent and warrant that you are 21 years old and a licensed hemp /
                  cbd and or cannabis vendor in good standing and authorized to conduct cannabis-related business
                  activities in your respective jurisdiction.
                </p>
                <p>
                  Pacific Rim Fusion cannot guarantee the truth, accuracy or legality of listings or the ability of
                  sellers to sell items or the ability of buyers to pay for items. Pacific Rim Fusion also cannot ensure
                  that a buyer or seller will actually complete a transaction or guarantee the true identity, age, and
                  nationality of a user. Pacific Rim Fusion encourages you to communicate directly with potential
                  transaction partners through the tools available on the Site. You may also wish to consider using a
                  third-party escrow service or services that provide additional user verification. You agree that to
                  the fullest extent protected by law, Pacific Rim Fusion is a marketplace and as such is not
                  responsible or liable for any content, for example, data, text, information, usernames, graphics,
                  images, photographs, profiles, audio, video, items, and links posted by you, other users, or third
                  parties on Pacific Rim Fusion.
                </p>
                <p>
                  Pacific Rim Fusion, will charge a NON REFUNDABLE PROCESSING FEE to the seller if using form of credit
                  card, e-check, on our payment gateway. The fee charged will be in a form of a % of the transaction.
                </p>
                <p>
                  It is the responsibility of the seller to pack, ship and optionally buy insurance for any product they
                  are shipping to the vendor they are selling to. We encourage the buyer to do verification of the items
                  that is being sold by the seller such as asking for COA (certificate of analysis and other means
                  before you decide to bid or buy the item for sale.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Membership Plans</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <h3 className="font-medium text-gradient">Membership Terms and Conditions</h3>

                <div>
                  <h4 className="font-medium text-gradient">1. Membership Plans</h4>
                  <p>
                    Pacific Rim Fusion, LLC ("the Company") offers various paid membership and other service plans that
                    provide users with specific privileges on our auction and listing platform. Each membership plan
                    includes a set quantity of auction or listing creations and a set quantity of purchase or bid
                    placements and the ability to communicate with other vendors by using our built in communication
                    platform.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">2. Plan Details</h4>
                  <p>
                    2.1. The specific details of each membership and service plans, including the number of
                    auctions/listings allowed and the number of purchases/bids permitted, number of sponsored listings,
                    are outlined on our website and in the plan description at the time of purchase.
                  </p>
                  <p>
                    2.2. The Company reserves the right to modify, add, or remove membership plans at any time. Any
                    changes to existing plans will be communicated to members in advance and will not affect the current
                    term of active memberships.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">3. Membership Purchase and Activation</h4>
                  <p>3.1. Users must create an account on our platform to purchase a membership plan.</p>
                  <p>3.2. Membership plans become active immediately upon successful payment processing.</p>
                  <p>3.3. The term of each membership plan is specified in the plan details at the time of purchase.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">4. Usage of Membership Privileges</h4>
                  <p>
                    4.1. Members may create auctions or listings up to the quantity specified in their plan during the
                    membership term.
                  </p>
                  <p>
                    4.2. Members may place bids or make purchases up to the quantity specified in their plan during the
                    membership term.
                  </p>
                  <p>
                    4.3. Unused auction/listing creations or bid/purchase privileges will roll over to subsequent
                    membership terms or renewals.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">5. Membership Renewal and Cancellation</h4>
                  <p>
                    5.1. Memberships do not automatically renew. Members must manually renew their plan to continue
                    enjoying membership privileges.
                  </p>
                  <p>
                    5.2. The Company reserves the right to cancel or suspend a membership if a member violates these
                    Terms and Conditions or the platform's general Terms of Service.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">6. Refunds and Transfers</h4>
                  <p>6.1. Membership fees are non-refundable once the plan is purchased.</p>
                  <p>6.2. Memberships are non-transferable and cannot be shared between users.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">7. Limitations and Restrictions</h4>
                  <p>
                    7.1. The Company reserves the right to impose reasonable limitations on the use of membership
                    privileges to prevent abuse or misuse of the platform.
                  </p>
                  <p>
                    7.2. Members are prohibited from using their privileges for any unlawful purpose or in violation of
                    the platform's general Terms of Service.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">8. Modifications to Terms and Conditions</h4>
                  <p>
                    8.1. The Company reserves the right to modify these Membership Terms and Conditions at any time.
                    Members will be notified of any significant changes.
                  </p>
                  <p>
                    8.2. Continued use of the membership privileges after such modifications constitutes acceptance of
                    the updated Terms and Conditions.
                  </p>
                </div>

                <p>
                  By purchasing a membership plan, you acknowledge that you have read, understood, and agree to be bound
                  by these Membership Terms and Conditions in addition to our platform's general Terms of Service.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Use of the Platform</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <div>
                  <h4 className="font-medium text-gradient">1. License</h4>
                  <p>
                    Pacific Rim Fusion grants you a non-exclusive, non-transferable, revocable license to access and use
                    the Platform for your business purposes, subject to these terms and conditions.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">2. Prohibited Activities</h4>
                  <p>
                    You agree not to use the Platform for any unlawful or prohibited purpose, including but not limited
                    to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Distributing hemp/cbd and recreational cannabis to minors</li>
                    <li>Engaging in illegal drug trafficking</li>
                    <li>Violating the laws of your jurisdiction (Country, State, Province, etc..)</li>
                    <li>
                      Communicating or soliciting contacts from other vendors to transact outside the Platform (Strictly
                      Prohibited and will result in immediate account termination and loss of proceeds paid to Pacific
                      Rim Fusion for membership plans, and all transaction fees)
                    </li>
                    <li>Any other activities that Pacific Rim Fusion deems inappropriate or unacceptable</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Communication Restrictions</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <div>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>All communication and transactions must remain on the Pacific Rim Fusion platform.</li>
                    <li>
                      Users are not allowed to request or provide email addresses, phone numbers, or other personal
                      contact details to communicate outside of Pacific Rim Fusion. This includes social media.
                    </li>
                    <li>
                      Any necessary exchange of personal information should only occur within the Order transaction
                      details.
                    </li>
                    <li>
                      Users are prohibited from soliciting parties introduced through Pacific Rim Fusion to contract,
                      engage, or pay outside the platform.
                    </li>
                  </ol>
                </div>

                <h4 className="font-medium text-gradient mt-4">Consequences of Breaking Communication Rules:</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Warning: Users may receive a warning for breaching Pacific Rim Fusion's policies.</li>
                  <li>
                    Account Restriction: As an intermediate action before permanent suspension, accounts may be
                    restricted.
                  </li>
                  <li>
                    Account Suspension: Accounts may be permanently suspended for:
                    <ul className="list-disc pl-6 mt-1">
                      <li>Severe breach of Pacific Rim Fusion policies mentioned.</li>
                    </ul>
                  </li>
                  <li>Removal of Content: Pacific Rim Fusion may remove content that violates their policies.</li>
                  <li>
                    Loss of Pacific Rim Fusion Support: Users who communicate or conduct business outside the platform
                    are violating terms of use and will be at risk to forfeit Pacific Rim Fusion's services.
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-gradient">
                Auctions, Listings, and Transactions
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <div>
                  <h4 className="font-medium text-gradient">1. Auctions and Listings</h4>
                  <p>
                    The Platform allows you to create auctions, listings, make an offer and buy-now options for your
                    cbd/hemp and recreational cannabis products. You are solely responsible for the accuracy and
                    completeness of the information provided in your auctions and listings. (Providing misleading and
                    false information in any auctions or listings you create is strictly prohibited and will be subject
                    for review and possible termination of account)*
                  </p>
                  <p className="italic mt-2">
                    *Thailand – We advise not to use pictures of the cannabis flower, use only pictures of the
                    certificate of analysis, descriptions and or pictures of the package products for Auctions and
                    Listings.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">2. Bids and Purchases and Making an Offer</h4>
                  <p>
                    Users can place bids or make an offer on auctions and purchase or make an offer from listings of
                    products. All transactions facilitated through the Platform are binding contracts between vendor
                    seller and the vendor buyer.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">3. Payments and Fulfillment</h4>
                  <p>
                    Pacific Rim Fusion is not responsible for payments, returns, or exchanges between vendors, sellers
                    and buyers. These matters are solely between the transacting parties.
                  </p>
                  <p className="mt-2">
                    Pacific Rim Fusion is not responsible for resolving disputes between vendors. The terms state:
                    "Payment for transactions between vendors on any auctions or listing types is between them along
                    with any return or exchanges. Pacific Rim Fusion is not responsible for this."
                  </p>
                  <p className="mt-2">
                    Vendors are expected to resolve disputes directly with each other. The platform does not mediate or
                    arbitrate conflicts between users.
                  </p>
                  <p className="mt-2">
                    Pacific Rim Fusion reserves the right to terminate accounts of vendors who engage in prohibited
                    activities or violate the terms and conditions. This could potentially be applied if a dispute
                    involves misconduct by one or both parties.
                  </p>
                  <p className="mt-2">
                    The terms emphasize that Pacific Rim Fusion does not guarantee product quality or testing. Sellers
                    are responsible for providing quality assurances and documentation to buyers. This places the onus
                    on vendors to clearly communicate product details to avoid disputes.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">4. Product Quality</h4>
                  <p>
                    Pacific Rim Fusion does not guarantee or test the quality of products listed on the Platform. It is
                    the responsibility of the seller to provide accurate quality assurances, testing documentation, and
                    product information to buyers. It is also the responsibility of buyer to perform due diligence on
                    the products they are buying from the seller.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Compliance and Termination</AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-4">
                <div>
                  <h4 className="font-medium text-gradient">1. Legal Compliance</h4>
                  <p>
                    You must comply with all applicable laws and regulations in your jurisdiction related to cannabis
                    sales and distribution.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gradient">2. Termination</h4>
                  <p>
                    Pacific Rim Fusion reserves the right to cancel and terminate any vendor or user account that
                    violates these terms and conditions or engages in illegal or illicit activities.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Disclaimers and Limitations</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Pacific Rim Fusion provides the Platform "as is" without warranties of any kind. Pacific Rim Fusion is
                  not responsible for any damages, losses, or liabilities arising from your use of the Platform or
                  transactions facilitated through it.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Indemnification</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  You agree to indemnify, defend, and hold harmless Pacific Rim Fusion, its affiliates, and their
                  respective officers, directors, employees, and agents from and against any claims, liabilities,
                  damages, losses, and expenses arising from your use of the Platform or violation of these terms and
                  conditions.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-semibold text-gradient">Modifications</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Pacific Rim Fusion reserves the right to modify these terms and conditions at any time without prior
                  notice. Your continued use of the Platform after any modifications constitutes your acceptance of the
                  updated terms and conditions.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By using the Pacific Rim Fusion Platform, you acknowledge that you have read, understood, and agreed to
              these terms and conditions.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: March 17, 2025</p>
          </div>
        </CardContent>
      </Card>
    </div>
        </div>
        <div className="mt-8 flex justify-end">
            <Button
              onClick={() => downloadTermsAsPDF(contentRef.current)}
            >
              <FileDown /> Download
            </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
