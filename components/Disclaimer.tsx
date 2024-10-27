// react/nextjs components
import React from "react";

// icons
import { IoCloseCircleSharp } from "react-icons/io5";

type DisclaimerProps = {
  setShowDisPopup: React.Dispatch<
    React.SetStateAction<null | "signAndSave" | "saveDontSign">
  >;
  showDisPopup: null | "signAndSave" | "saveDontSign";
};

const Disclaimer: React.FC<DisclaimerProps> = ({
  showDisPopup,
  setShowDisPopup,
}) => {
  return (
    <>
      {showDisPopup && (
        <div className="relative h-fit w-1/2 flex flex-col items-center justify-center gap-3 bg-white p-8 mx-44 my-10 rounded shadow-md">
          <button
            onClick={() => setShowDisPopup(null)}
            className="absolute -top-4 -right-4"
          >
            <IoCloseCircleSharp size={48} color="#2563eb" />
          </button>
          {showDisPopup === "signAndSave" ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">
                E-Signature and Compliance Notice
              </h2>
              <p className="mt-2">
                By using this application to electronically sign documents
                related to clinical trials, you acknowledge and agree to the
                following:
              </p>
              <ul className="space-y-3 text-sm mt-2 list-disc pl-6">
                <li>
                  Legal Validity: Your electronic signature carries the same
                  legal weight as a handwritten signature under applicable laws,
                  including the U.S. Electronic Signatures in Global and
                  National Commerce Act (E-SIGN Act) and Uniform Electronic
                  Transactions Act (UETA), as well as international equivalents
                  where applicable.
                </li>
                <li>
                  Informed Consent: By signing electronically, you confirm that
                  you have thoroughly read and understood the content of the
                  clinical trial documents, including any associated risks,
                  benefits, and procedures involved, and that you are
                  voluntarily providing your consent.
                </li>
                <li>
                  Confidentiality: All information signed through this
                  application is strictly confidential and protected under HIPAA
                  (Health Insurance Portability and Accountability Act) or
                  equivalent laws governing medical privacy. By using the
                  platform, you agree to the secure storage and transmission of
                  your personal information as outlined in the privacy policy.
                </li>
                <li>
                  Security: We employ industry-standard security measures to
                  ensure the confidentiality, integrity, and authenticity of all
                  e-signature transactions. However, you are responsible for
                  safeguarding your own account credentials and access to the
                  platform.
                </li>
                <li>
                  Non-Coercion: By electronically signing, you confirm that your
                  decision to participate in any clinical trial or related
                  activity has been made freely, without coercion or undue
                  influence.
                </li>
                <li>
                  Regulatory Compliance: Our application complies with FDA 21
                  CFR Part 11 regulations for electronic records and signatures
                  in clinical trials. However, users are responsible for
                  ensuring that all actions performed through this application
                  adhere to any additional regulatory requirements specific to
                  their jurisdiction.
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">
                Disclaimer for Non-E-Signature Trials
              </h2>
              <p className="mt-2">
                Acknowledgment of Legal Information Without E-Signature. By
                proceeding with this clinical trial, you acknowledge and agree
                to the following:
              </p>
              <ul className="space-y-3 text-sm mt-2 list-disc pl-6">
                <li>
                  Inability to E-Sign: Due to local facility or state
                  regulations, electronic signatures are not permitted in this
                  clinical trial. You are aware that you will not be able to
                  sign electronically, and an alternative method will be used to
                  verify your consent and approval.
                </li>
                <li>
                  Legal Validity of Information: Although you are unable to
                  provide an electronic signature, you confirm that all
                  information presented to you in this trial documentation is
                  legally binding and accurate. You agree that your
                  acknowledgment of this information holds the same legal weight
                  as if you had provided an electronic signature.
                </li>
                <li>
                  Informed Consent: By acknowledging this disclaimer, you
                  confirm that you have thoroughly reviewed and understood the
                  content of the clinical trial documents, including any
                  associated risks, benefits, and procedures involved, and you
                  provide your consent to participate.
                </li>
                <li>
                  Confidentiality: All information shared with you in this trial
                  is strictly confidential and protected under HIPAA (Health
                  Insurance Portability and Accountability Act) or equivalent
                  laws governing medical privacy. You agree to the secure
                  storage and use of your personal information in accordance
                  with our privacy policy.
                </li>
                <li>
                  Security: While we cannot facilitate an e-signature process in
                  this trial, we take measures to ensure the confidentiality and
                  integrity of all your information. You are responsible for
                  ensuring that your personal details and trial-related
                  information remain secure during your participation.
                </li>
                <li>
                  Non-Coercion: By acknowledging this disclaimer, you confirm
                  that your decision to participate in this clinical trial or
                  related activities has been made freely, without coercion or
                  undue influence.
                </li>
                <li>
                  Regulatory Compliance: We ensure that all information provided
                  and collected in this clinical trial complies with relevant
                  regulations. However, participants are responsible for
                  ensuring that they understand and comply with the regulations
                  specific to their jurisdiction.
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Disclaimer;
