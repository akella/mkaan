// import Hero from "@/components/sections/Hero";

// const components = {
//   'sections.hero': Hero,
// }

// // Section renderer
// export const RenderSection = ({ section }) => {
//   if(!Object.keys(components).includes(section.__component)) return null;
//   const Component = components[section.__component];
//   return <Component {...section} />;
// }

// // Page sections renderer
// export default function RenderStrapiSections({ data }) {
//   const sections = data?.Sections;
//   if (!sections) return null;

//   return (
//     <main>
//       {sections.map((section) => (
//         <RenderSection key={section.id} section={section} />
//       ))}
//     </main>
//   );
// }
