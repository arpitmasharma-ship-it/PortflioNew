import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { FadeIn, Stagger, motion, staggerItem } from '../components/common/Motion.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { skillCategoryLabels } from '../constants/nav.js';
import { IconByName } from '../utils/icons.jsx';

export default function Skills() {
  const { skills } = usePortfolio();
  const grouped = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <>
      <Seo title="Skills" path="/skills" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Skills"
          title="A toolkit I actually use."
          description="Organized by how I work, not by invented percentages. I would rather show projects than score myself."
        />
        {skills.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="No skills yet" body="Skills added in the admin panel appear here." />
          </div>
        ) : (
          <div className="mt-14 space-y-14">
            {Object.entries(grouped).map(([category, items]) => (
              <FadeIn key={category}>
                <h2 className="font-display text-2xl text-ink">
                  {skillCategoryLabels[category] || category}
                </h2>
                <Stagger className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((skill) => (
                    <motion.div
                      key={skill._id}
                      variants={staggerItem}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 transition hover:border-ink/20 hover:bg-cream/70"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-sage">
                        <IconByName name={skill.icon} size={16} />
                      </span>
                      <span className="text-sm font-medium text-ink">{skill.name}</span>
                    </motion.div>
                  ))}
                </Stagger>
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
