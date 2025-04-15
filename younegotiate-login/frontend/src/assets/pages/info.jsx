import React from "react";

const InfoSteps = () => {
  const steps = [
    {
      number: "1",
      title: "Creditor Joins",
      description: "Set term offers and upload accounts",
      icon: "./images/features_opportunity.png", // replace with your icon path
    },
    {
      number: "2",
      title: "Consumers Free Portal Account",
      description:
        "View offers, respond, create offers, pay, dispute and manage plans from personal DIT portal account. Mobile or computer",
      icon: "./images/features_user.png",
    },
    {
      number: "3",
      title: "Everyone Can Help",
      description:
        "Now your friends, family, favorite sports team/celebrity, employer – anyone and everyone can help you pay down your accounts and get an IRS tax write off!",
      icon: "./images/features_payment.png",
    },
    {
      number: "4",
      title: "Consumers Self Manage Accounts",
      description:
        "Consumers can manage all payment plans in one place to support real life circumstances.",
      icon: "./images/features_reschedule.png",
    },
  ];

  return (
    <section id="how-it-works" className="p-6 md:p-12 md:m-10 bg-white "
    //style={{ boxShadow: "0 4px 10px rgba(59, 130, 246, 0.5)" }}
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-2xl p-6 shadow-md flex flex-col gap-4 hover:shadow-lg transition-shadow "
            //style={{ boxShadow: "10px 4px 10px rgba(59, 130, 246, 0.5)" }}
          >
            <div className="flex items-center gap-4 ">
              <div className="text-3xl font-bold text-black">{step.number}</div>
              <img src={step.icon} alt={step.title} className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold text-black">{step.title}</h3>
            <p className="text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoSteps;
