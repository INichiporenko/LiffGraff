type BrandLogoProps = {
    className?: string;
    size?: "sm" | "md" | "lg";
};

const sizeStyles = {
    sm: { fontSize: "28px", lineHeight: "32px" },
    md: { fontSize: "36px", lineHeight: "40px" },
    lg: { fontSize: "42px", lineHeight: "48px" },
};

export const BrandLogo = ({ className = "", size = "md" }: BrandLogoProps) => (
    <span
        className={`inline-block text-[#262626] ${className}`}
        style={{
            fontFamily: "'Billabong', cursive",
            fontWeight: 400,
            ...sizeStyles[size],
        }}
        aria-label="LifeGraff"
    >
        LifeGraff
    </span>
);
