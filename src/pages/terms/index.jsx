import { terms } from "@/constants/terms";
const Terms = () => {
  return (
    <main className="min-w-2xs mx-auto p-6 bg-(--background) text-(--foreground) space-y-12">
      {/* English Terms */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
        {terms.english.map((item, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">
              {index + 1}. {item.title}
            </h3>
            <p className="text-(--secondary-foreground) text-sm mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      {/* Farsi Terms */}
      <section className="rtl" dir="rtl">
        {terms.farsi.map((item, index) => (
          <div key={index} className="mb-4 text-right">
            <h3 className="text-xl font-semibold">
              {index + 1}. {item.title}
            </h3>
            <p className="text-(--secondary-foreground) text-sm mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Terms;
