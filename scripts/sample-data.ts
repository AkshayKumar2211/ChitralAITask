export interface SampleCandidate {
  filename: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  summary: string;
  skills: string[];
  experience: { company: string; role: string; period: string; bullets: string[] }[];
  education: { school: string; degree: string; period: string }[];
  certifications?: string[];
}

export const sampleCandidates: SampleCandidate[] = [
  {
    filename: "aarav-sharma-senior-backend.pdf",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    title: "Senior Backend Engineer",
    summary:
      "Backend engineer with 8 years of experience designing high-throughput services on Node.js and PostgreSQL. Strong AWS background, with hands-on Kubernetes and Redis. Comfortable owning systems from design to production.",
    skills: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "AWS (EC2, RDS, S3, Lambda)",
      "Docker",
      "Kubernetes",
      "REST APIs",
      "GraphQL",
      "Prisma",
      "Microservices",
      "CI/CD",
    ],
    experience: [
      {
        company: "Fintwirl Pvt Ltd",
        role: "Senior Backend Engineer",
        period: "2021 – Present",
        bullets: [
          "Led migration of a monolithic Express service to 6 Node.js microservices on EKS, cutting p95 latency by 38%.",
          "Owned the Postgres schema, query patterns, and a read-replica strategy for a 120 GB transactional database.",
          "Built a usage-based billing pipeline using AWS SQS + Lambda processing ~12M events/day.",
        ],
      },
      {
        company: "Glidepath Tech",
        role: "Backend Engineer",
        period: "2017 – 2021",
        bullets: [
          "Designed and shipped a REST API consumed by 4 client teams.",
          "Introduced structured logging + tracing (OpenTelemetry) across services.",
        ],
      },
    ],
    education: [
      {
        school: "Indian Institute of Technology, Bombay",
        degree: "B.Tech, Computer Science and Engineering",
        period: "2013 – 2017",
      },
    ],
    certifications: ["AWS Certified Solutions Architect — Associate"],
  },
  {
    filename: "priya-patel-fullstack.pdf",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 99887 22110",
    title: "Full-Stack Engineer",
    summary:
      "Full-stack engineer with 5 years of experience across Node.js backends and React frontends. Comfortable shipping product features end-to-end and instrumenting them for measurement.",
    skills: [
      "Node.js",
      "Express",
      "TypeScript",
      "React",
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "REST APIs",
      "AWS S3",
      "Docker",
      "Tailwind CSS",
      "Jest",
    ],
    experience: [
      {
        company: "Brevily Inc",
        role: "Full-Stack Engineer",
        period: "2022 – Present",
        bullets: [
          "Built the onboarding flow used by 90k+ users on the Next.js + Express stack.",
          "Owned the team's CI pipeline and integration test harness; reduced flaky failures by ~60%.",
        ],
      },
      {
        company: "OpenLedger",
        role: "Software Engineer",
        period: "2020 – 2022",
        bullets: [
          "Shipped a customer dashboard with React + REST APIs backed by PostgreSQL.",
          "Reduced report generation time from ~12s to <2s by introducing materialized views.",
        ],
      },
    ],
    education: [
      {
        school: "BITS Pilani",
        degree: "B.E., Computer Science",
        period: "2016 – 2020",
      },
    ],
  },
  {
    filename: "rohan-mehta-frontend.pdf",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 98123 55667",
    title: "Frontend Developer",
    summary:
      "Frontend developer focused on React and design systems. 4 years building consumer-facing web apps with TypeScript and Tailwind CSS.",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Redux Toolkit",
      "Storybook",
      "Vite",
      "Jest",
      "Accessibility (WCAG)",
      "Figma",
    ],
    experience: [
      {
        company: "Vellora Studios",
        role: "Frontend Developer",
        period: "2022 – Present",
        bullets: [
          "Rebuilt the product's design system in React + Tailwind, consumed by 5 teams.",
          "Owned the migration from CRA to Next.js App Router with full TypeScript coverage.",
        ],
      },
      {
        company: "Klera",
        role: "UI Engineer",
        period: "2020 – 2022",
        bullets: [
          "Shipped marketing site + waitlist flow in Next.js with strong Core Web Vitals scores.",
        ],
      },
    ],
    education: [
      {
        school: "Manipal Institute of Technology",
        degree: "B.Tech, Information Technology",
        period: "2016 – 2020",
      },
    ],
  },
  {
    filename: "sneha-iyer-data-engineer.pdf",
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91 96100 88912",
    title: "Data Engineer",
    summary:
      "Data engineer with 6 years building batch + streaming pipelines for analytics workloads. Strong with Python, SQL, and modern warehouses.",
    skills: [
      "Python",
      "SQL",
      "Apache Airflow",
      "dbt",
      "Snowflake",
      "BigQuery",
      "Kafka",
      "Spark",
      "AWS Glue",
      "PostgreSQL",
      "Pandas",
    ],
    experience: [
      {
        company: "Northgrain Analytics",
        role: "Senior Data Engineer",
        period: "2021 – Present",
        bullets: [
          "Designed an Airflow + dbt pipeline ingesting ~400M rows/day into Snowflake.",
          "Cut warehouse compute spend ~22% by rewriting hot dbt models with incremental materialization.",
        ],
      },
      {
        company: "Vexa",
        role: "Data Engineer",
        period: "2018 – 2021",
        bullets: [
          "Built Kafka → Spark Structured Streaming jobs for clickstream enrichment.",
        ],
      },
    ],
    education: [
      {
        school: "VIT Vellore",
        degree: "B.Tech, Computer Science",
        period: "2014 – 2018",
      },
    ],
  },
  {
    filename: "karan-desai-devops.pdf",
    name: "Karan Desai",
    email: "karan.desai@example.com",
    phone: "+91 90909 12345",
    title: "DevOps / Platform Engineer",
    summary:
      "Platform engineer with 7 years operating Kubernetes-based infrastructure on AWS. Strong with Terraform, observability tooling, and incident response.",
    skills: [
      "Kubernetes",
      "Terraform",
      "AWS (EKS, IAM, VPC, RDS)",
      "Docker",
      "GitHub Actions",
      "ArgoCD",
      "Prometheus",
      "Grafana",
      "Linux",
      "Bash",
      "Python",
    ],
    experience: [
      {
        company: "Crestbyte",
        role: "Senior DevOps Engineer",
        period: "2020 – Present",
        bullets: [
          "Migrated 40+ services to EKS with Terraform-managed cluster modules.",
          "Built an internal developer platform on top of ArgoCD with self-serve preview environments.",
        ],
      },
      {
        company: "Quantmint",
        role: "SRE",
        period: "2017 – 2020",
        bullets: [
          "Owned the on-call rotation and SLO instrumentation for the payments API.",
        ],
      },
    ],
    education: [
      {
        school: "PES University, Bangalore",
        degree: "B.E., Computer Science",
        period: "2013 – 2017",
      },
    ],
    certifications: ["Certified Kubernetes Administrator (CKA)"],
  },
  {
    filename: "aditi-rao-junior.pdf",
    name: "Aditi Rao",
    email: "aditi.rao@example.com",
    phone: "+91 97000 33221",
    title: "Junior Software Developer",
    summary:
      "Recent CS graduate with one year of internship experience. Comfortable with Java fundamentals and SQL; eager to grow into backend engineering.",
    skills: [
      "Java",
      "Spring Boot (basics)",
      "SQL",
      "Git",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    experience: [
      {
        company: "TCS",
        role: "Software Engineering Intern",
        period: "Jan 2024 – Dec 2024",
        bullets: [
          "Wrote Java unit tests and small features under mentor review.",
          "Helped triage support tickets and reproduce bugs in staging.",
        ],
      },
    ],
    education: [
      {
        school: "SRM Institute of Science and Technology",
        degree: "B.Tech, Computer Science",
        period: "2020 – 2024",
      },
    ],
  },
];

export interface SampleJd {
  title: string;
  content: string;
  requiredSkills: string[];
  minExperience: number;
  education: string;
}

const SEED_MARKER = "[Seed]";

export function isSeedTitle(title: string) {
  return title.startsWith(SEED_MARKER);
}

export const sampleJds: SampleJd[] = [
  {
    title: `${SEED_MARKER} Senior Backend Engineer`,
    content:
      "We are hiring a Senior Backend Engineer to own core API services for our payments platform. You will design and operate Node.js services backed by PostgreSQL on AWS. Strong ownership over data modeling, performance, and reliability is expected.\n\nResponsibilities:\n- Design REST and event-driven services in Node.js + TypeScript.\n- Own the PostgreSQL schema and query patterns for transactional workloads.\n- Build, deploy, and monitor services on AWS (EC2, RDS, S3, Lambda).\n- Mentor mid-level engineers and lead design reviews.\n\nWe care about: clean abstractions, observability, and a strong production-engineering mindset.",
    requiredSkills: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "AWS",
      "REST APIs",
      "Docker",
    ],
    minExperience: 5,
    education: "Bachelor's in Computer Science or equivalent practical experience",
  },
  {
    title: `${SEED_MARKER} Frontend Engineer (React)`,
    content:
      "Looking for a Frontend Engineer who can ship polished React applications with strong attention to UX and accessibility. You'll work closely with design and own the frontend codebase for a B2B product.\n\nResponsibilities:\n- Build features in React + TypeScript + Tailwind CSS.\n- Maintain a component library used across product surfaces.\n- Partner with designers and ensure WCAG-compliant implementations.\n- Improve Core Web Vitals and front-end performance.\n\nNice to have: experience with Next.js App Router and design systems.",
    requiredSkills: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Next.js",
      "Accessibility",
    ],
    minExperience: 3,
    education: "Bachelor's degree or equivalent experience",
  },
  {
    title: `${SEED_MARKER} Data Engineer`,
    content:
      "Hiring a Data Engineer to build the analytical backbone of our product. You'll own ETL/ELT pipelines into a cloud data warehouse and partner with analysts to ship reliable models.\n\nResponsibilities:\n- Build and maintain Airflow + dbt pipelines into Snowflake or BigQuery.\n- Model data for product analytics and downstream BI consumers.\n- Optimize warehouse cost and query performance.\n- Own data quality and lineage tooling.\n\nWe care about correctness, idempotency, and reproducibility.",
    requiredSkills: [
      "Python",
      "SQL",
      "Apache Airflow",
      "dbt",
      "Snowflake",
      "BigQuery",
    ],
    minExperience: 4,
    education: "Bachelor's in Computer Science, Statistics, or related field",
  },
];
