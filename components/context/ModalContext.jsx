"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMatchMedia";
import ButtonLink from "../ui/ButtonLink";
import SocialLinks from "../ui/SocilaLinks";
import UaeClock from "../ui/UaeClock";
import { useForm } from "react-hook-form";
import codes from "@/lib/telCodes";
import { useLenis } from "lenis/react";
import { gsap } from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const FORM_ENDPOINTS = {
  buying: "own-with-mkaan-feedback-forms",
  partnership: "partner-with-mkaan-feedback-forms",
};

const ModalContext = createContext();

const CATEGORY_OPTIONS = ["buying", "partnership"];
const DEFAULT_CATEGORY = CATEGORY_OPTIONS[0];
const STEP_GAP_PX = 24;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeCategory = (value) => {
  if (typeof value !== "string") {
    return DEFAULT_CATEGORY;
  }

  const normalized = value.toLowerCase();
  if (CATEGORY_OPTIONS.includes(normalized)) {
    return normalized;
  }

  if (normalized === "become-partner") {
    return "partnership";
  }

  return DEFAULT_CATEGORY;
};

export const ModalProvider = ({ children, data }) => {
  const secondStep = data?.Second_section;
  const thirdStep = data?.Third_section;
  const fourthStep = data?.Fourth_section;
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const steps = useMemo(
    () => [
      "category",
      "contacts",
      ...(activeCategory === "buying" ? ["types"] : []),
      "message",
    ],
    [activeCategory],
  );
  const [currentStep, setCurrentStep] = useState(0);
  const stepRefs = useRef({});
  const containerRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const resizeObserverRef = useRef(null);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const codeDropdownRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const autoResizeTextarea = (event) => {
    const el = event.target;
    if (!el) return;

    const maxHeight = 152;
    el.style.height = "auto";
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    // el.style.marginTop = "10px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  const setStepRef = (name) => (el) => {
    stepRefs.current[name] = el;
  };

  const getElHeight = (el) => {
    if (!el) return 0;
    const rectH = el.getBoundingClientRect().height || 0;
    const offH = el.offsetHeight || 0;
    const scrollH = el.scrollHeight || 0;
    return Math.max(rectH, offH, scrollH);
  };

  const setContainerHeightByName = (name) => {
    const el = stepRefs.current[name];
    if (containerRef.current && el) {
      const h = getElHeight(el);
      containerRef.current.style.height = `${h}px`;
    }
  };

  useLayoutEffect(() => {
    if (!isOpen) return;

    // Initialize positions for all step panels whenever step list changes or modal opens
    const firstName = steps[0];
    if (!firstName) return;
    const names = steps;
    names.forEach((name, i) => {
      const el = stepRefs.current[name];
      if (!el) return;
      if (i === 0) {
        gsap.set(el, { xPercent: 0, opacity: 1, display: "block" });
      } else {
        gsap.set(el, { xPercent: -50, opacity: 0, display: "block" });
      }
    });
    setCurrentStep(0);
    setContainerHeightByName(firstName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, isOpen]);

  useEffect(() => {
    // Observe active step content and update height dynamically
    const activeName = steps[currentStep];
    const activeEl = stepRefs.current[activeName];
    if (!activeEl || !containerRef.current) return;

    // Disconnect previous observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    const ro = new ResizeObserver(() => {
      const h = getElHeight(activeEl);
      containerRef.current.style.height = `${h}px`;
    });
    ro.observe(activeEl);
    resizeObserverRef.current = ro;

    // Also adjust on window resize
    const onWinResize = () => {
      const h = getElHeight(activeEl);
      containerRef.current.style.height = `${h}px`;
    };
    window.addEventListener("resize", onWinResize);

    return () => {
      window.removeEventListener("resize", onWinResize);
      ro.disconnect();
    };
  }, [currentStep]);

  // Close dial-code dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!isCodeOpen) return;
      if (
        codeDropdownRef.current &&
        !codeDropdownRef.current.contains(e.target)
      ) {
        setIsCodeOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isCodeOpen]);

  const animateToStep = (targetIndex) => {
    if (isAnimatingRef.current) return;
    if (targetIndex === currentStep) return;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const currentName = steps[currentStep];
    const targetName = steps[targetIndex];
    const currentEl = stepRefs.current[currentName];
    const incomingEl = stepRefs.current[targetName];
    const forward = targetIndex > currentStep;

    isAnimatingRef.current = true;
    gsap.set(incomingEl, {
      xPercent: forward ? 100 : -100,
      x: forward ? STEP_GAP_PX : -STEP_GAP_PX,
      opacity: 0,
      display: "block",
    });

    // Pre-set container to the taller of current/incoming to avoid clipping
    const preH = Math.max(getElHeight(currentEl), getElHeight(incomingEl));
    if (containerRef.current) {
      containerRef.current.style.height = `${preH}px`;
    }

    const tl = gsap.timeline({
      defaults: { ease: "cubic-bezier(0.76, 0, 0.24, 1)", duration: 0.6 },
      onComplete: () => {
        setCurrentStep(targetIndex);
        setContainerHeightByName(targetName);
        isAnimatingRef.current = false;
      },
    });

    tl.to(
      currentEl,
      {
        xPercent: forward ? -100 : 100,
        x: forward ? -STEP_GAP_PX : STEP_GAP_PX,
        opacity: 0,
      },
      0,
    ).to(incomingEl, { xPercent: 0, x: 0, opacity: 1 }, 0);
  };

  const nextStep = async () => {
    const name = steps[currentStep];
    const fields = getFieldsForStep(name);
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    animateToStep(Math.min(currentStep + 1, steps.length - 1));
  };
  const prevStep = () => animateToStep(Math.max(currentStep - 1, 0));

  // Clamp current step if the step list shrinks (e.g., partnership removes 'types')
  useEffect(() => {
    const maxIdx = steps.length - 1;
    if (currentStep > maxIdx) setCurrentStep(maxIdx);
  }, [steps.length]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (isOpen) {
      ScrollTrigger.normalizeScroll({
        // Allow wheel/trackpad to scroll nested overflow containers (dropdowns, modals)
        allowNestedScroll: true,
      });
    } else {
      ScrollTrigger.normalizeScroll(false);
    }

    return () => {
      ScrollTrigger.normalizeScroll(false);
    };
  }, [isOpen]);

  const openModal = (category) => {
    const nextCategory = normalizeCategory(category);
    setActiveCategory(nextCategory);
    setCurrentStep(0);
    setIsSubmitted(false);
    setSubmitError(null);
    setIsSubmitting(false);
    setIsCodeOpen(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsSubmitted(false);
    setSubmitError(null);
    setIsSubmitting(false);
    setCurrentStep(0);
    setActiveCategory(DEFAULT_CATEGORY);
    setIsCodeOpen(false);
  };

  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "auto";
      lenis?.start();
    }
  }, [isOpen, lenis]);

  useEffect(() => {
    setIsSubmitting(false);
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    setSubmitError(null);
    setIsSubmitted(false);
    setIsSubmitting(false);

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
    clearErrors,
    trigger,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneCode: "380", // default to Ukraine (+380)
      phoneNumber: "",
      propertyType: "House",
      area: "100-200",
      message: "",
      businessEmail: "",
      companyName: "",
      propertyDescription: "",
    },
  });

  const selectedPropertyType = watch("propertyType");
  const selectedArea = watch("area");

  const getFieldsForStep = (name) => {
    if (name === "contacts") {
      if (activeCategory === "buying") {
        return ["fullName", "email", "phoneNumber"];
      }
      return ["fullName", "companyName", "businessEmail", "phoneNumber"];
    }
    if (name === "types" && activeCategory === "buying") {
      const base = ["propertyType", "area"];
      if (selectedPropertyType?.toLowerCase() === "other") {
        base.push("propertyDescription");
      }
      return base;
    }
    if (name === "message") {
      return ["message"];
    }
    return [];
  };

  const handleCategorySelect = (category) => {
    const normalized = normalizeCategory(category);
    if (normalized === activeCategory) return;
    setActiveCategory(normalized);
    setIsSubmitted(false);
    setSubmitError(null);
  };

  const isActive = (name) => steps[currentStep] === name;
  const isLastStep = currentStep === steps.length - 1;

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setSubmitError(null);
    setIsSubmitted(true);

    const digitsOnly = (str) => (str || "").replace(/[^0-9]/g, "");
    const phone = `+${digitsOnly(data.phoneCode)}${digitsOnly(
      data.phoneNumber,
    )}`;
    const { phoneCode, phoneNumber, propertyDescription, ...rest } = data;

    const trimmedDescription = propertyDescription?.trim();

    const payload =
      activeCategory === "partnership"
        ? {
            Name: rest.fullName?.trim() || "",
            Phone: phone,
            Message: rest.message?.trim() || "",
            Company_name: rest.companyName?.trim() || "",
            Company_email: rest.businessEmail?.trim() || "",
          }
        : {
            Name: rest.fullName?.trim() || "",
            Phone_number: phone,
            Message: rest.message?.trim() || "",
            Email: rest.email?.trim() || "",
            Property_type: rest.propertyType,
            Area: rest.area,
            // property_description:
            //   rest.propertyType?.toLowerCase() === "other"
            //     ? trimmedDescription || null
            //     : null,
          };

    const endpoint =
      FORM_ENDPOINTS[activeCategory] ?? FORM_ENDPOINTS[DEFAULT_CATEGORY];

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to submit form (status ${response.status})`,
        );
      }

      setSubmitError(null);
      reset();
      setCurrentStep(0);
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitted(false);
      setSubmitError("Something went wrong. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors) => {
    console.log("Form Errors: ", errors);
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <div
        className={`${
          isOpen ? "main-form-el-show" : "pointer-events-none main-form-el"
        } fixed  z-80 inset-0 bg-[radial-gradient(85.67%_97.28%_at_100%_0%,_#592D42_0%,_#3A1A29_100%)] p-6 max-md:p-4 md:transition-all md:duration-400 md:ease-[var(--ease-in-out)] flex flex-col`}
      >
        <div className="md:hidden flex justify-between items-start">
          <button
            onClick={closeModal}
            className="group relative text-textWhite p-2.5 rounded-full border border-brownDark md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:hover:duration-500 md:hover:ease-[var(--ease-in)] md:hover:text-wine"
          >
            <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"></div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="relative z-10"
            >
              <path
                d="M5.33198 15.2566L4.74219 14.6668L9.40885 10.0001L4.74219 5.33344L5.33198 4.74365L9.99865 9.41032L14.6653 4.74365L15.2551 5.33344L10.5884 10.0001L15.2551 14.6668L14.6653 15.2566L9.99865 10.5899L5.33198 15.2566Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="pl-6 text-right">
            <UaeClock />
            <p>UAE, Dubai</p>
          </div>
        </div>
        <div className="flex h-full">
          <div className="grow flex max-md:hidden">
            <div className="pr-14 border-r border-r-brownDark">
              <button
                onClick={closeModal}
                className="group relative text-textWhite p-2.5 rounded-full border border-brownDark md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:hover:duration-500 md:hover:ease-[var(--ease-in)] md:hover:text-wine"
              >
                <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"></div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="relative z-10"
                >
                  <path
                    d="M5.33198 15.2566L4.74219 14.6668L9.40885 10.0001L4.74219 5.33344L5.33198 4.74365L9.99865 9.41032L14.6653 4.74365L15.2551 5.33344L10.5884 10.0001L15.2551 14.6668L14.6653 15.2566L9.99865 10.5899L5.33198 15.2566Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col justify-between grow text-14 border-r border-r-brownDark ">
              <div className="pl-6">
                <UaeClock />
                <p>UAE, Dubai</p>
              </div>
              <Image
                src={"/icons/logo-form-big.svg"}
                alt="logo"
                width={226}
                height={144}
                className="mx-auto"
              />
              <ul className="flex flex-col gap-6 text-14 max-md:gap-4 max-w-[60%] max-lg:max-w-[90%] pl-6">
                <li>
                  <p className="opacity-40">E.</p>
                  <Link
                    className="relative overflow-y-hidden block group"
                    href="mailto:hello@mkaan.com"
                  >
                    <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                      hello@mkaan.com
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                      hello@mkaan.com
                    </span>
                  </Link>{" "}
                </li>
                <li>
                  <p className="opacity-40">M.</p>
                  <Link
                    className="relative overflow-y-hidden block group"
                    href="tel:+97145235096"
                  >
                    <span className="block md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                      +971 4 523 5096
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                      +971 4 523 5096
                    </span>
                  </Link>
                </li>
                <li>
                  <p className="opacity-40">A.</p>
                  <div className="group">
                    <p className="relative overflow-y-hidden cursor-pointer">
                      <span className="block md:transition-transform md:duration-500 delay-75 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                        Level 4, Office 404-06
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 delay-75 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                        Level 4, Office 404-06
                      </span>
                    </p>
                    <p className="relative overflow-y-hidden cursor-pointer">
                      <span className="block md:transition-transform md:duration-500 delay-200 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                        Deyaar Head Office Building
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 delay-200 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                        Deyaar Head Office Building
                      </span>
                    </p>
                    <p className="relative overflow-y-hidden cursor-pointer">
                      <span className="block md:transition-transform md:duration-500 delay-300 md:ease-[var(--ease-link)] md:group-hover:-translate-y-full">
                        Al Barsha1, Dubai UAE
                      </span>
                      <span className="absolute top-0 left-0 w-full h-full flex items-center transform translate-y-full md:transition-transform md:duration-500 delay-300 md:ease-[var(--ease-link)] md:group-hover:translate-y-0">
                        Al Barsha1, Dubai UAE
                      </span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative w-[66.67%] max-md:w-full md:overflow-x-clip">
            <div
              className={`w-[432px] max-lg:w-[75%] max-md:w-full pt-[123px] max-md:pt-[160px] mx-auto ${
                isSubmitted ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <div id="pagination" className="flex gap-1 mb-6">
                {steps.map((_, idx) => (
                  <div
                    key={`dot-${idx}`}
                    className={`w-1 h-1 rounded-full bg-textWhite md:transition-opacity md:duration-300 ${
                      idx <= currentStep ? "opacity-100" : "opacity-10"
                    }`}
                  ></div>
                ))}
              </div>
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <div
                  className={`relative ${isOpen ? "" : "pointer-events-none"}`}
                  ref={containerRef}
                >
                  {/* Category */}
                  <div
                    id="category"
                    ref={setStepRef("category")}
                    className={`absolute inset-0 w-full ${isOpen ? "" : "!pointer-events-none"}`}
                    style={{
                      pointerEvents:
                        isActive("category") && isOpen ? "auto" : "none",
                    }}
                  >
                    <h3 className="text-36">
                      Select Your <br /> Interest to Proceed
                    </h3>
                    <div className="w-full flex flex-col gap-2 text-14 mt-12 max-md:mt-10">
                      <button
                        type="button"
                        data-cursor-area={`${
                          activeCategory === "buying" ? "light" : ""
                        }`}
                        id="buying"
                        className={`group relative p-4 border  border-brownDark flex flex-col gap-3 items-start ${
                          activeCategory === "buying"
                            ? "bg-textWhite text-dark"
                            : "border md:hover:bg-textWhite md:hover:text-wine md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                        }`}
                        onClick={(e) =>
                          handleCategorySelect(e.currentTarget.id)
                        }
                      >
                        {activeCategory === "buying" && (
                          <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 active-cat md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"></div>
                        )}
                        <div
                          className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border ${
                            activeCategory === "buying"
                              ? "border-dark"
                              : "border-brownDark md:group-hover:border-dark md:transition-colors md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                          } ml-auto`}
                        >
                          <div
                            className={`w-1 h-1 rounded-full bg-dark ${
                              activeCategory === "buying"
                                ? "opacity-100"
                                : "opacity-0 md:transition-opacity md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                            }`}
                          ></div>
                        </div>
                        <span className="relative z-10">
                          {data.First_section.First_option}
                        </span>
                      </button>
                      <button
                        type="button"
                        data-cursor-area={`${
                          activeCategory === "partnership" ? "light" : ""
                        }`}
                        id="partnership"
                        className={`group relative p-4 border  border-brownDark flex flex-col gap-3 items-start ${
                          activeCategory === "partnership"
                            ? "bg-textWhite  text-dark"
                            : "border md:hover:bg-textWhite md:hover:text-wine md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                        }`}
                        onClick={(e) =>
                          handleCategorySelect(e.currentTarget.id)
                        }
                      >
                        {activeCategory === "partnership" && (
                          <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 active-cat md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"></div>
                        )}
                        <div
                          className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border ${
                            activeCategory === "partnership"
                              ? "border-dark"
                              : "border-brownDark md:group-hover:border-dark md:transition-colors md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                          } ml-auto`}
                        >
                          <div
                            className={`w-1 h-1 rounded-full bg-dark ${
                              activeCategory === "partnership"
                                ? "opacity-100"
                                : "opacity-0 md:transition-opacity md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                            }`}
                          ></div>
                        </div>
                        <span className="relative z-10">
                          {data.First_section.Second_option}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div
                    id="contacts"
                    ref={setStepRef("contacts")}
                    className={`${isOpen ? "" : "!pointer-events-none"} absolute inset-0 w-full`}
                    style={{
                      pointerEvents: isActive("contacts") ? "auto" : "none",
                    }}
                  >
                    <h3 className="text-36">
                      Select Your <br /> Interest to Proceed
                    </h3>
                    <div className="flex flex-col gap-[18px] mt-12">
                      <div className="relative group">
                        <input
                          {...register("fullName", {
                            required: "Name is required",
                          })}
                          id="fullName"
                          type="text"
                          className={`peer text-14 py-4 border-b border-b-brownDark ${
                            errors.fullName ? "border-b-red" : ""
                          } w-full `}
                          placeholder=" "
                        />
                        {!errors.fullName && (
                          <div className="absolute w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                        )}
                        <label
                          htmlFor="fullName"
                          className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-11 md:transition-all md:duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                        >
                          {secondStep.Name}
                        </label>
                      </div>
                      {activeCategory === "buying" ? (
                        <div className="relative group">
                          <input
                            id="email"
                            {...register("email", {
                              required: "Email is required",
                              minLength: {
                                value: 5,
                                message: "Email must be at least 5 characters",
                              },
                              pattern: {
                                value: EMAIL_REGEX,
                                message: "Enter a valid email address",
                              },
                            })}
                            type="email"
                            className={`peer text-14 py-4 border-b border-b-brownDark ${
                              errors.email ? "border-b-red" : ""
                            } w-full `}
                            placeholder=" "
                          />
                          {!errors.email && (
                            <div className="absolute w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                          )}
                          <label
                            htmlFor="email"
                            className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-11 md:transition-all md:duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                          >
                            {secondStep.Email}
                          </label>
                        </div>
                      ) : (
                        <>
                          <div className="relative group">
                            <input
                              {...register("companyName", {
                                required: " Company Name is required",
                              })}
                              id="companyName"
                              type="text"
                              className={`peer text-14 py-4 border-b border-b-brownDark ${
                                errors.companyName ? "border-b-red" : ""
                              } w-full `}
                              placeholder=" "
                            />
                            {!errors.companyName && (
                              <div className="absolute w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                            )}
                            <label
                              htmlFor="companyName"
                              className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-11 md:transition-all md:duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                            >
                              {secondStep.Company_name}
                            </label>
                          </div>
                          <div className="relative group">
                            <input
                              id="businessEmail"
                              {...register("businessEmail", {
                                required: "Email is required",
                                minLength: {
                                  value: 5,
                                  message:
                                    "Email must be at least 5 characters",
                                },
                                pattern: {
                                  value: EMAIL_REGEX,
                                  message: "Enter a valid email address",
                                },
                              })}
                              type="email"
                              className={`peer text-14 py-4 border-b border-b-brownDark ${
                                errors.businessEmail ? "border-b-red" : ""
                              } w-full `}
                              placeholder=" "
                            />
                            {!errors.businessEmail && (
                              <div className="absolute w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                            )}
                            <label
                              htmlFor="businessEmail"
                              className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-11 md:transition-all md:duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                            >
                              {secondStep.Business_email}
                            </label>
                          </div>
                        </>
                      )}

                      {/* Phone */}
                      <div className="flex items-center gap-4">
                        <div className="relative" ref={codeDropdownRef}>
                          <button
                            type="button"
                            id="phoneCode"
                            className="relative group text-14 w-max py-4 border-b border-b-brownDark bg-transparent flex gap-6 items-center justify-between"
                            onClick={() => setIsCodeOpen((v) => !v)}
                            aria-haspopup="listbox"
                            aria-expanded={isCodeOpen}
                          >
                            <span>+{watch("phoneCode")}</span>

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="6"
                              viewBox="0 0 9 6"
                              fill="none"
                              className={`md:transition-transform md:duration-300 ${
                                isCodeOpen ? "rotate-180" : "rotate-0"
                              }`}
                            >
                              <path
                                d="M4.42313 5.01292L0 0.589792L0.589792 0L4.42313 3.83333L8.25646 0L8.84625 0.589792L4.42313 5.01292Z"
                                fill="#F7F7EB"
                              />
                            </svg>

                            <div className="absolute bottom-0 w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                          </button>
                          <label
                            htmlFor="phoneCode"
                            className="select-none pointer-events-none absolute left-0 top-px text-11 opacity-40"
                          >
                            Label
                          </label>

                          <div
                            onWheel={(e) => {
                              e.stopPropagation();
                            }}
                            role="listbox"
                            className={`form-phone-codes ${isCodeOpen ? "open" : ""} absolute w-[350px] z-10 left-0 right-0 mt-2 max-h-48 overflow-y-auto  bg-[rgba(58,26,41,0.95)]`}
                          >
                            {codes.map((c) => (
                              <div
                                key={c.iso}
                                role="option"
                                aria-selected={watch("phoneCode") === c.code}
                                className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                                  watch("phoneCode") === c.code
                                    ? "bg-textWhite text-dark"
                                    : "md:hover:bg-[rgba(247,247,235,0.08)]"
                                }`}
                                onClick={() => {
                                  setValue("phoneCode", c.code, {
                                    shouldValidate: true,
                                    shouldTouch: true,
                                  });
                                  clearErrors("phoneCode");
                                  setIsCodeOpen(false);
                                }}
                              >
                                <span>+{c.code}</span>
                                <span className="text-11 opacity-40 ml-2">
                                  {c.country}
                                </span>
                              </div>
                            ))}
                          </div>

                          {errors.phoneCode && (
                            <span className="absolute top-full">
                              {errors.phoneCode.message}
                            </span>
                          )}
                        </div>
                        <div className="relative w-full group">
                          <input
                            id="phoneNumber"
                            type="tel"
                            placeholder=" "
                            className={`peer text-14 py-4 border-b border-b-brownDark ${
                              errors.phoneNumber ? "border-b-red" : ""
                            } w-full `}
                            {...register("phoneNumber", {
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9()\s-]{6,}$/,
                                message: "Enter a valid phone number",
                              },
                            })}
                          />
                          {!errors.phoneNumber && (
                            <div className="absolute w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                          )}
                          <label
                            htmlFor="phoneNumber"
                            className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-11 md:transition-all md:duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                          >
                            {secondStep.Phone_number}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Types (only for buying) */}
                  {activeCategory === "buying" && (
                    <div
                      data-lenis-prevent
                      id="types"
                      ref={setStepRef("types")}
                      className={`${isOpen ? "" : "!pointer-events-none"} form-types scrollbar-hide absolute inset-0 w-full max-sm:!h-[544px] md:overflow-y-auto max-sm:overflow-auto [@media(min-width:768px)_and_(max-height:820px)]:h-[550px]  [@media(min-width:768px)_and_(max-height:820px)]:pb-9 ${
                        selectedPropertyType === "other"
                          ? "md:h-[560px] overflow-auto"
                          : ""
                      }`}
                      style={{
                        pointerEvents: isActive("types") ? "auto" : "none",
                      }}
                    >
                      <h3 className="text-36">
                        Help us understand <br /> your needs better.
                      </h3>
                      <div className="relative mt-12 text-14 flex flex-col gap-6 pb-28 max-sm:pb-[220px]">
                        <div>
                          <p className="text-11 opacity-40 mb-4">
                            property type
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {thirdStep.Property_type.map((option) => (
                              <label
                                key={option.Type}
                                className={`group relative flex flex-col gap-3 p-4 border border-brownDark cursor-pointer ${
                                  selectedPropertyType === option.Type
                                    ? "bg-textWhite  text-dark"
                                    : "md:hover:bg-textWhite md:hover:text-wine md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                                }`}
                              >
                                {selectedPropertyType === option.Type && (
                                  <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 active-cat md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"></div>
                                )}
                                <input
                                  type="radio"
                                  className="hidden"
                                  value={option.Type}
                                  {...register("propertyType", {
                                    required: "Select property type",
                                  })}
                                />
                                <div
                                  className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border ${
                                    selectedPropertyType === option.Type
                                      ? "border-dark"
                                      : "border-brownDark md:group-hover:border-dark md:transition-border md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                                  } ml-auto`}
                                >
                                  <div
                                    className={`w-1 h-1 rounded-full bg-dark ${
                                      selectedPropertyType === option.Type
                                        ? "opacity-100"
                                        : "opacity-0 md:transition-opacity md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)"
                                    }`}
                                  ></div>
                                </div>
                                <span className="relative z-10">
                                  {option.Type}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        {selectedPropertyType === "Other" && (
                          <div className="relative group">
                            <input
                              {...register("propertyDescription", {
                                required: "Name is required",
                                minLength: {
                                  value: 5,
                                  message: "Name must be at least 5 characters",
                                },
                              })}
                              id="propertyDescription"
                              type="text"
                              className={`${
                                errors.propertyDescription ? "border-b-red" : ""
                              } peer text-14 py-4 border-b border-b-brownDark w-full`}
                              placeholder=" "
                            />
                            {!errors.propertyDescription && (
                              <div className="absolute w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                            )}
                            <label
                              htmlFor="propertyDescription"
                              className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-11 transition-all duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                            >
                              describe your property
                            </label>
                          </div>
                        )}
                        <div>
                          <p className="text-11 opacity-40 mb-4">
                            area ( FT2 )
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {thirdStep.Area.map((option) => (
                              <label
                                key={option.FT}
                                className={`relative group flex flex-col gap-3 p-4 border border-brownDark cursor-pointer ${
                                  selectedArea === option.FT
                                    ? "bg-textWhite  text-dark"
                                    : "md:hover:bg-textWhite md:hover:text-wine md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                                }`}
                              >
                                {selectedArea === option.FT && (
                                  <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 active-cat md:transition-all md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"></div>
                                )}
                                <input
                                  type="radio"
                                  className="hidden"
                                  value={option.FT}
                                  {...register("area", {
                                    required: "Select area",
                                  })}
                                />
                                <div
                                  className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border ${
                                    selectedArea === option.FT
                                      ? "border-dark"
                                      : "border-brownDark md:group-hover:border-dark md:transition-border md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)]"
                                  } ml-auto`}
                                >
                                  <div
                                    className={`w-1 h-1 rounded-full bg-dark ${
                                      selectedArea === option.FT
                                        ? "opacity-100"
                                        : "opacity-0 md:transition-opacity md:duration-[var(--durIn)] md:ease-[var(--ease-in-out)"
                                    }`}
                                  ></div>
                                </div>
                                <span className="relative z-10">
                                  {option.FT}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div
                    id="message"
                    ref={setStepRef("message")}
                    className={`absolute inset-0 w-full ${isOpen ? "" : "!pointer-events-none"}`}
                    style={{
                      pointerEvents: isActive("message") ? "auto" : "none",
                    }}
                  >
                    {activeCategory === "buying" ? (
                      <h3 className="text-36">
                        Anything You’d <br /> Like Us to Know?
                      </h3>
                    ) : (
                      <h3 className="text-36">
                        Share Your Proposal <br /> or Partnership Idea
                      </h3>
                    )}

                    <div className="mt-12 max-md:mt-16">
                      <div className="relative group">
                        <textarea
                          {...register("message", {
                            required: "Message is required",
                            minLength: {
                              value: 10,
                              message: "Message must be at least 10 characters",
                            },
                            onChange: autoResizeTextarea,
                          })}
                          id="message"
                          rows={1}
                          placeholder=" "
                          className={`peer text-14 pb-4 border-b border-b-brownDark ${
                            errors.message ? "border-b-red" : ""
                          } w-full`}
                        ></textarea>
                        {!errors.message && (
                          <div className="absolute bottom-[7px] w-full h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                        )}
                        <label
                          htmlFor="message"
                          className="select-none pointer-events-none absolute left-0 top-1/2 -translate-y-[12px] text-11 transition-all duration-400 peer-focus:top-[-8px] max-sm:peer-focus:top-[-5%] peer-[:not(:placeholder-shown)]:top-[-8px] max-sm:peer-[:not(:placeholder-shown)]:top-[-5%]  peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                        >
                          {fourthStep.Message}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 absolute bottom-6 max-md:bottom-10 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`${currentStep === 2 && activeCategory === "buying" ? "opacity-100" : "opacity-0"} [@media(min-width:1024px)_and_(min-height:1000px)]:hidden pointer-events-none absolute w-[300%] max-lg:w-[320%] max-md:w-screen h-[150px] bottom-[55%] left-[-100%] max-lg:left-[-110%] max-md:left-[-150%] z-[-1] bg-[linear-gradient(180deg,_rgba(58,_26,_41,_0.00)_0%,_#3A1A29_100%)]`}
                  ></div>

                  <button
                    id="prev step"
                    className={`group relative text-textWhite p-2.5 rounded-full border border-brownDark md:transition-all md:duration-500 md:hover:duration-500 md:ease-[var(--ease-in-out)] md:hover:ease-[var(--ease-in)] md:hover:text-wine ${
                      currentStep === 0 ? "hidden" : ""
                    }`}
                    type="button"
                    onClick={prevStep}
                  >
                    <div className="absolute inset-0 rounded-full bg-textWhite transform scale-0 md:transition-all md:duration-500 md:ease-[var(--ease-in-out)] md:group-hover:scale-100 md:group-hover:duration-400 md:group-hover:ease-[var(--ease-in)]"></div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="relative z-10"
                    >
                      <path
                        d="M5.76901 10.4167L10.5959 15.2436L10.0013 15.8334L4.16797 10L10.0013 4.16669L10.5959 4.75648L5.76901 9.58335H15.8346V10.4167H5.76901Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <ButtonLink
                    text={isLastStep ? "submit" : "next step"}
                    type={isLastStep ? "submit" : "button"}
                    onClick={isLastStep ? undefined : nextStep}
                  />
                </div>
              </form>
            </div>

            <div
              className={`absolute right-0 w-[72.5%] max-md:w-full bottom-0 max-md:bottom-10 flex flex-col gap-[184px] max-md:gap-[270px] ${
                isSubmitted ? "" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex flex-col gap-6 max-w-[400px] max-md:max-w-[330px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-textWhite"></div>
                  <p className="text-11">success</p>
                </div>
                <h3 className="text-36">
                  {data.Success_section.Description_1}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-y-16">
                <p className="text-14 col-span-2">
                  {data.Success_section.Description_2}
                </p>
                <SocialLinks />

                <ButtonLink
                  text={"back to home"}
                  tag="a"
                  href="/"
                  needTransition={false}
                  onClick={closeModal}
                  className={"flex w-fit ml-auto"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
