import React from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const SocialButtons = ({ socials }) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    {socials.map((social) => {
      const Icon = social.icon;
      return (
        <IconButton
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          size="small"
          sx={{
            color: "text.secondary",
            bgcolor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              color: "primary.main",
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              bgcolor: "rgba(59, 130, 246, 0.05)",
            },
          }}
        >
          <Icon fontSize="small" sx={{ fontSize: 18 }} />
        </IconButton>
      );
    })}
  </Box>
);

const unusedVar = "test";
const Footer = () => {
  const quickLinks = [
    { name: "About", href: "#about" },
    { name: "Events", href: "/events" },
    { name: "Membership", href: "#membership" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "https://www.instagram.com/buc_india" },
    { name: "Twitter", href: "https://x.com/Buc_India" },
    { name: "YouTube", href: "https://www.youtube.com/@BucIndia" },
    { name: "Facebook", href: "https://www.facebook.com/HumanityGcalls/" },
  ];

  const scrollToTop = () => {
    gsap.to(window, { duration: 1, scrollTo: 0, ease: "power4.inOut" });
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#020617",
        background: "linear-gradient(to bottom, #020617 0%, #030712 100%)",
        borderTop: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.05)",
        pt: { xs: 6, md: 8 },
        pb: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Main 3-Column Grid */}
        <Grid container spacing={{ xs: 5, md: 4, lg: 8 }} sx={{ mb: 6 }}>
          {/* Column 1: Brands & Description */}
          <Grid item xs={12} md={5} lg={4}>
            {/* BUC India Section */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  component="img"
                  src={buclogo}
                  alt="Bikers Unity Calls Logo"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Audiowide", sans-serif',
                    fontSize: "1.2rem",
                    color: "text.primary",
                  }}
                >
                  Buc_India
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 2,
                  lineHeight: 1.6,
                  fontSize: "0.85rem",
                  pr: { md: 4 },
                }}
              >
                Founded in 2025, we are India's Premier Riding Community,
                dedicated to safe riding, brotherhood, and inspiring change for
                a better tomorrow.
              </Typography>
              <SocialButtons
                socials={[
                  { icon: FacebookIcon, href: "#", name: "Facebook" },
                  {
                    icon: InstagramIcon,
                    href: "https://www.instagram.com/buc_india",
                    name: "Instagram",
                  },
                  {
                    icon: XIcon,
                    href: "https://x.com/Buc_India",
                    name: "Twitter",
                  },
                  {
                    icon: YouTubeIcon,
                    href: "https://www.youtube.com/@BucIndia",
                    name: "YouTube",
                  },
                ]}
              />
            </Box>

            {/* Humanity Calls Section */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    bgcolor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0.5,
                  }}
                >
                  <Box
                    component="img"
                    src="https://static.wixstatic.com/media/2d0007_ccad2163f88540659e8212ff5138666c~mv2.png/v1/fit/w_2500,h_1330,al_c/2d0007_ccad2163f88540659e8212ff5138666c~mv2.png"
                    alt="Humanity Calls Logo"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: "0.95rem",
                      lineHeight: 1,
                    }}
                  >
                    Humanity Calls
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "info.main",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      letterSpacing: 0.5,
                    }}
                  >
                    COMPASSION & ACTION
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 2,
                  lineHeight: 1.5,
                  fontSize: "0.8rem",
                  pr: { md: 4 },
                }}
              >
                A non-profit initiative built on the belief that service to
                humanity is our highest responsibility.
              </Typography>
              <SocialButtons
                socials={[
                  {
                    icon: FacebookIcon,
                    href: "https://www.facebook.com/HumanityGcalls/",
                    name: "Facebook",
                  },
                  {
                    icon: InstagramIcon,
                    href: "https://www.instagram.com/humanitycalls_?igshid=MXBmb2d5MDFudm9waw%3D%3D",
                    name: "Instagram",
                  },
                  {
                    icon: XIcon,
                    href: "https://x.com/Humanitycalls1",
                    name: "Twitter",
                  },
                  {
                    icon: YouTubeIcon,
                    href: "https://www.youtube.com/@humanitycalls",
                    name: "YouTube",
                  },
                  {
                    icon: LanguageIcon,
                    href: "https://www.humanitycalls.org",
                    name: "Website",
                  },
                ]}
              />
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={12} sm={6} md={3} lg={4}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 2.5,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: "0.75rem",
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {quickLinks.map((link) => (
                <Box component="li" key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    underline="none"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.85rem",
                      transition: "all 0.2s ease",
                      position: "relative",
                      display: "inline-block",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: 0,
                        height: "1px",
                        bottom: -2,
                        left: 0,
                        bgcolor: "primary.main",
                        transition: "width 0.3s ease",
                      },
                      "&:hover": { color: "text.primary" },
                      "&:hover::after": { width: "100%" },
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Contact Info */}
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 2.5,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: "0.75rem",
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <EmailIcon
                  sx={{ color: "text.secondary", fontSize: 18, mt: 0.2 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                >
                  bikersunitycallsindia@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                >
                  +91 88677 18080
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOnIcon
                  sx={{ color: "text.secondary", fontSize: 18, mt: 0.2 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                  }}
                >
                  Bengaluru, Karnataka
                  <br />
                  India 560001
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Horizontal Emergency Numbers */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 2.5,
            bgcolor: "rgba(255,255,255,0.02)",
            borderRadius: 1.25,
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Emergency Dial:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2, md: 4 },
            }}
          >
            {emergencyContacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <Link
                  key={contact.name}
                  href={`tel:${contact.number}`}
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.primary",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "error.main" },
                  }}
                >
                  <Icon
                    sx={{ fontSize: 16, color: "error.main", opacity: 0.8 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, fontSize: "0.9rem" }}
                  >
                    {contact.number}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    ({contact.name})
                  </Typography>
                </Link>
              );
            })}
          </Box>
        </Box>

        {/* Thin Divider & Bottom Bar */}
        <Divider sx={{ mt: 5, mb: 3, borderColor: "rgba(255,255,255,0.05)" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} Bikers Unity Calls. All rights
            reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy", "Terms", "Conduct"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
