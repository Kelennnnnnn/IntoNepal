import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Badge,
  ReviewScoreChip,
  LevelBadge,
  Input,
  Select,
  Textarea,
  LoadingSkeleton,
  Skeleton,
  EmptyState,
  ErrorState,
  Table,
  TableHeader,
  TableBody,
  TableHeadCell,
  Row,
  Cell,
  Modal,
  ConfirmDialog,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  toast,
  Toaster,
} from './ui';
import {
  CheckCircle2,
  ShieldCheck,
  Compass,
  Mountain,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Mail,
  Lock,
  Layers,
  Calendar as CalendarIcon,
  ExternalLink,
  MoreVertical,
  Share2,
  FileDown,
  Heart,
  Info,
  ChevronRight,
  PackageCheck,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  // Interactive showcase states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 9, 15));
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState('All');
  const [inputText, setInputText] = useState('Everest Base Camp');
  const [selectedRegion, setSelectedRegion] = useState('khumbu');

  const filterChips = [
    'All',
    'Annapurna',
    'Khumbu / Everest',
    'Langtang',
    'Manaslu',
    'Mustang',
    'Dolpo',
    'Short Treks (1-5 days)',
    'High Passes',
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1A1F1D] pb-24">
      {/* Top Header */}
      <header className="border-b border-[#E8E4DD] bg-[#FBF8F3]">
        <div className="wrap py-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded bg-[#D97706] text-white flex items-center justify-center font-serif font-black text-lg select-none">
                IN
              </span>
              <div>
                <h1 className="t-h2 font-serif font-bold tracking-tight text-[#1A1F1D]">
                  Into Nepal — Design System
                </h1>
                <p className="text-xs sm:text-sm text-[#5F6B66]">
                  Travel Marketplace Component Library & Token Specification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge tone="verified" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Matte Finish Strictly Enforced
              </Badge>
              <Badge tone="info">Tailwind v4 @theme</Badge>
            </div>
          </div>

          <p className="text-sm text-[#5F6B66] max-w-3xl leading-relaxed">
            Every component adheres to the matte design standard: 1px borders, zero resting shadows,
            subtle hover lifts (+1px buttons, +3px cards), no glow or gradients, and absolutely no backdrop-blur.
          </p>
        </div>
      </header>

      {/* Main Container with .wrap */}
      <main className="wrap py-10 space-y-16">
        {/* =========================================================================
            SECTION 1: COLOR & DESIGN TOKENS
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              1. Color Tokens & Surfaces
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Configured via CSS-first <code className="text-[#1E4B8F] font-mono">@theme</code> inside <code className="text-[#1E4B8F] font-mono">src/index.css</code>.
            </p>
          </div>

          <div className="space-y-6">
            {/* Surfaces */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                Surfaces & Lines
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-[#E8E4DD] bg-[#FFFFFF]">
                  <div className="text-xs font-bold text-[#1A1F1D]">Canvas</div>
                  <div className="text-[11px] text-[#5F6B66] font-mono">#FFFFFF</div>
                  <div className="text-[10px] text-[#8E9994] mt-2">Primary App Surface</div>
                </div>
                <div className="p-3 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3]">
                  <div className="text-xs font-bold text-[#1A1F1D]">Cream</div>
                  <div className="text-[11px] text-[#5F6B66] font-mono">#FBF8F3</div>
                  <div className="text-[10px] text-[#8E9994] mt-2">Warm Secondary Surface</div>
                </div>
                <div className="p-3 rounded-lg border border-[#D9D3C9] bg-[#E8E4DD]">
                  <div className="text-xs font-bold text-[#1A1F1D]">Line</div>
                  <div className="text-[11px] text-[#5F6B66] font-mono">#E8E4DD</div>
                  <div className="text-[10px] text-[#8E9994] mt-2">1px Standard Border</div>
                </div>
                <div className="p-3 rounded-lg border border-[#B8B0A2] bg-[#D9D3C9]">
                  <div className="text-xs font-bold text-[#1A1F1D]">Line-Strong</div>
                  <div className="text-[11px] text-[#5F6B66] font-mono">#D9D3C9</div>
                  <div className="text-[10px] text-[#8E9994] mt-2">Active Dividers</div>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                Action & Semantic Palette
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Amber */}
                <div className="p-3 rounded-lg bg-[#D97706] text-white">
                  <div className="text-xs font-bold">Amber CTA</div>
                  <div className="text-[11px] font-mono opacity-90">#D97706</div>
                  <div className="text-[10px] opacity-80 mt-1">CTA, Prices</div>
                </div>
                <div className="p-3 rounded-lg bg-[#B45309] text-white">
                  <div className="text-xs font-bold">Amber Dark</div>
                  <div className="text-[11px] font-mono opacity-90">#B45309</div>
                  <div className="text-[10px] opacity-80 mt-1">Button Hover</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FEF4E7] border border-[#D97706]/30 text-[#B45309]">
                  <div className="text-xs font-bold">Amber Tint</div>
                  <div className="text-[11px] font-mono opacity-90">#FEF4E7</div>
                  <div className="text-[10px] opacity-80 mt-1">Promo Badges</div>
                </div>

                {/* Blue */}
                <div className="p-3 rounded-lg bg-[#1E4B8F] text-white">
                  <div className="text-xs font-bold">Blue Trust</div>
                  <div className="text-[11px] font-mono opacity-90">#1E4B8F</div>
                  <div className="text-[10px] opacity-80 mt-1">Review Chips, Links</div>
                </div>
                {/* Green */}
                <div className="p-3 rounded-lg bg-[#1B7A5A] text-white">
                  <div className="text-xs font-bold">Green Verified</div>
                  <div className="text-[11px] font-mono opacity-90">#1B7A5A</div>
                  <div className="text-[10px] opacity-80 mt-1">Verified Badges</div>
                </div>
                {/* Red */}
                <div className="p-3 rounded-lg bg-[#C8362E] text-white">
                  <div className="text-xs font-bold">Red Alert</div>
                  <div className="text-[11px] font-mono opacity-90">#C8362E</div>
                  <div className="text-[10px] opacity-80 mt-1">Errors, Destructive</div>
                </div>
              </div>
            </div>

            {/* Typography Tokens */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                Text & Typography
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-[#E8E4DD] bg-[#FFFFFF]">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#1A1F1D] mr-2 align-middle" />
                  <span className="text-xs font-bold text-[#1A1F1D]">Ink (#1A1F1D)</span>
                  <p className="text-xs text-[#5F6B66] mt-1 font-serif">Fraunces Serif Display</p>
                </div>
                <div className="p-3 rounded-lg border border-[#E8E4DD] bg-[#FFFFFF]">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#5F6B66] mr-2 align-middle" />
                  <span className="text-xs font-bold text-[#5F6B66]">Slate (#5F6B66)</span>
                  <p className="text-xs text-[#5F6B66] mt-1">Plus Jakarta Sans Body</p>
                </div>
                <div className="p-3 rounded-lg border border-[#E8E4DD] bg-[#FFFFFF]">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#8E9994] mr-2 align-middle" />
                  <span className="text-xs font-bold text-[#8E9994]">Slate-Light (#8E9994)</span>
                  <p className="text-xs text-[#5F6B66] mt-1">Metadata & Form Hints</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: FLUID UTILITIES
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              2. Fluid Utilities (@layer components)
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Fluid clamps that eliminate jarring breakpoint jumps across mobile, tablet, and wide desktop.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg p-5">
              <div className="text-xs font-mono text-[#5F6B66] mb-1">.t-display (clamp 1.75rem to 3.25rem)</div>
              <h1 className="t-display font-bold text-[#1A1F1D]">
                Himalayan Expeditions & Treks
              </h1>

              <div className="text-xs font-mono text-[#5F6B66] mt-4 mb-1">.t-h1 (clamp 1.5rem to 2.375rem)</div>
              <h2 className="t-h1 font-bold text-[#1A1F1D]">
                Verified Nepali Agencies & Guides
              </h2>

              <div className="text-xs font-mono text-[#5F6B66] mt-4 mb-1">.t-h2 (clamp 1.25rem to 1.75rem)</div>
              <h3 className="t-h2 font-bold text-[#1A1F1D]">
                Safe, Direct, Transparent Booking
              </h3>
            </div>

            {/* .rail utility */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">
                  .rail Utility (Horizontal Scroll Filter Chips, Scrollbar Hidden)
                </h3>
                <span className="text-xs text-[#8E9994]">Swipe horizontally</span>
              </div>
              <div className="rail gap-2 py-1">
                {filterChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setActiveChip(chip)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4B8F] ${
                      activeChip === chip
                        ? 'bg-[#1E4B8F] text-white border-[#1E4B8F]'
                        : 'bg-[#FFFFFF] text-[#5F6B66] border-[#E8E4DD] hover:bg-[#FBF8F3] hover:text-[#1A1F1D]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* .grid-stats utility */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                .grid-stats Utility (repeat(auto-fit, minmax(min(100%, 8.75rem), 1fr)))
              </h3>
              <div className="grid-stats">
                <Card>
                  <CardBody compact>
                    <div className="text-xs text-[#5F6B66]">Available Treks</div>
                    <div className="text-xl font-bold font-serif text-[#1A1F1D] mt-1">42</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody compact>
                    <div className="text-xs text-[#5F6B66]">Verified Agencies</div>
                    <div className="text-xl font-bold font-serif text-[#1A1F1D] mt-1">18</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody compact>
                    <div className="text-xs text-[#5F6B66]">Direct Comm.</div>
                    <div className="text-xl font-bold font-serif text-[#D97706] mt-1">15%</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody compact>
                    <div className="text-xs text-[#5F6B66]">Client Rating</div>
                    <div className="text-xl font-bold font-serif text-[#1E4B8F] mt-1">9.8/10</div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: BUTTONS
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              3. Button Component
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Solid matte fills, NO colored glow or gradient. Hover darkens + lifts 1px. Includes visible focus-visible ring.
            </p>
          </div>

          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                Variants (Primary, Secondary, Ghost, Destructive)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Amber</Button>
                <Button variant="secondary">Secondary Cream</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Red</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                Sizes (sm, md, lg)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small (sm)</Button>
                <Button variant="primary" size="md">Medium (md)</Button>
                <Button variant="primary" size="lg">Large (lg)</Button>
              </div>
            </div>

            {/* States: Loading, Disabled, Icons, Block */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                Interactive States (Loading, Disabled, Icons, Block)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button variant="primary" loading>
                  Processing...
                </Button>
                <Button variant="primary" disabled>
                  Disabled State
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Compass className="w-4 h-4" />}
                >
                  Explore Treks
                </Button>
                <Button
                  variant="primary"
                  block
                  rightIcon={<Calendar className="w-4 h-4" />}
                >
                  Full Width Block
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: CARDS & MATTE FINISH RULES
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              4. Card & Matte Finish Lift
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              1px border (#E8E4DD), zero resting shadow. Interactive cards lift 3px with shadow on hover only.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Resting Card */}
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <Badge tone="neutral">Resting Card</Badge>
                  <span className="text-xs text-[#8E9994]">Static</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D] mb-1">
                  Annapurna Circuit Trek
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed mb-4">
                  Standard matte finish card with 1px border. No shadow at rest.
                </p>
                <div className="text-xs font-semibold text-[#1A1F1D]">
                  From <span className="text-[#D97706] font-bold text-sm">$950</span> / person
                </div>
              </CardBody>
            </Card>

            {/* Interactive Card */}
            <Card interactive>
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <Badge tone="promo">Interactive Card</Badge>
                  <ReviewScoreChip rating={9.8} reviewCount={42} size="sm" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D] mb-1">
                  Everest Base Camp & Gokyo
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed mb-4">
                  Hover over this card to observe the 3px lift and subtle shadow emergence.
                </p>
                <div className="flex items-center justify-between">
                  <LevelBadge difficulty="Challenging" />
                  <span className="text-xs font-bold text-[#D97706]">$1,450</span>
                </div>
              </CardBody>
            </Card>

            {/* Agency Verified Card */}
            <Card interactive>
              <CardBody>
                <div className="flex items-center justify-between mb-3">
                  <Badge tone="verified" icon={<CheckCircle2 className="w-3 h-3" />}>
                    Govt. Licensed
                  </Badge>
                  <ReviewScoreChip rating={null} reviewCount={0} size="sm" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A1F1D] mb-1">
                  Himalayan Glacier Expeditions
                </h3>
                <p className="text-xs text-[#5F6B66] leading-relaxed mb-4">
                  New partner agency listed this season. Verified credentials in Nepal.
                </p>
                <div className="text-xs text-[#1E4B8F] font-semibold hover:underline">
                  View 6 Departure Dates →
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: BADGES, LEVEL BADGES & REVIEW CHIPS
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              5. Badges, LevelBadge & ReviewScoreChip
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Distinctive trust chips, difficulty levels (1-7), and Booking.com-style review boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Badges */}
            <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-4">
                Badge Tones
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <Badge tone="verified" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Verified Agency
                </Badge>
                <Badge tone="info">Instant Booking</Badge>
                <Badge tone="promo">Early Bird -15%</Badge>
                <Badge tone="urgent">Only 2 Spots Left</Badge>
                <Badge tone="neutral">Departing Nov 2026</Badge>
              </div>
            </div>

            {/* LevelBadges */}
            <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-4">
                LevelBadge (Easy 1, Mod 3, Chal 5, Diff 6, Exp 7)
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <LevelBadge difficulty="Easy" />
                  <span className="text-[11px] text-[#8E9994]">Cultural trails</span>
                </div>
                <div className="flex items-center justify-between">
                  <LevelBadge difficulty="Moderate" />
                  <span className="text-[11px] text-[#8E9994]">Poon Hill / Langtang</span>
                </div>
                <div className="flex items-center justify-between">
                  <LevelBadge difficulty="Challenging" />
                  <span className="text-[11px] text-[#8E9994]">Annapurna Circuit</span>
                </div>
                <div className="flex items-center justify-between">
                  <LevelBadge difficulty="Difficult" />
                  <span className="text-[11px] text-[#8E9994]">EBC 3 Passes</span>
                </div>
                <div className="flex items-center justify-between">
                  <LevelBadge difficulty="Expert" />
                  <span className="text-[11px] text-[#8E9994]">Dhaulagiri Circuit</span>
                </div>
              </div>
            </div>

            {/* ReviewScoreChips */}
            <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-4">
                ReviewScoreChip (Solid Blue, "New" when 0/null)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ReviewScoreChip rating={9.8} reviewCount={64} size="lg" />
                  <div>
                    <div className="text-xs font-bold text-[#1A1F1D]">Exceptional (9.8)</div>
                    <div className="text-[11px] text-[#5F6B66]">Based on 64 verified reviews</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ReviewScoreChip rating={8.4} reviewCount={12} size="md" />
                  <div>
                    <div className="text-xs font-bold text-[#1A1F1D]">Very Good (8.4)</div>
                    <div className="text-[11px] text-[#5F6B66]">Based on 12 verified reviews</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ReviewScoreChip rating={null} reviewCount={0} size="md" />
                  <div>
                    <div className="text-xs font-bold text-[#1E4B8F]">New Agency Listing</div>
                    <div className="text-[11px] text-[#5F6B66]">Renders "New" when rating is null</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ReviewScoreChip rating={4.5} reviewCount={0} size="sm" />
                  <div>
                    <div className="text-xs font-bold text-[#1E4B8F]">New (0 review count)</div>
                    <div className="text-[11px] text-[#5F6B66]">Fallback to "New" if count is 0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: FORM CONTROLS (Input, Select, Textarea)
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              6. Form Elements (Input, Select, Textarea)
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Full label, error, and hint support. 1px matte borders with focus-visible ring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Default & Hints */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">
                Standard with Hints
              </h3>
              <Input
                label="Search Trek or Destination"
                placeholder="e.g. Manaslu Circuit"
                hint="Filter by region, peak, or duration"
                leftIcon={<Search className="w-4 h-4" />}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <Select
                label="Himalayan Region"
                hint="Select departure area"
                value={selectedRegion}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRegion(e.target.value)}
                options={[
                  { value: 'khumbu', label: 'Khumbu / Everest Region' },
                  { value: 'annapurna', label: 'Annapurna Conservation Area' },
                  { value: 'langtang', label: 'Langtang Valley' },
                  { value: 'manaslu', label: 'Manaslu Restricted Area' },
                ]}
              />

              <Textarea
                label="Special Dietary or Medical Notes"
                placeholder="Vegetarian, high-altitude experience, gear requests..."
                hint="Shared with your licensed Nepali guide before departure"
                rows={3}
              />
            </div>

            {/* Error States */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8362E]">
                Validation Error States
              </h3>
              <Input
                label="Traveler Emergency Contact"
                defaultValue="invalid-email"
                error="Please provide a valid emergency phone number or email"
                required
              />

              <Select
                label="Passport Nationality"
                error="Nationality is required for Trekking Information Management (TIMS) permit"
                required
                options={[
                  { value: '', label: 'Select Nationality...' },
                  { value: 'np', label: 'Nepal' },
                  { value: 'us', label: 'United States' },
                  { value: 'de', label: 'Germany' },
                  { value: 'uk', label: 'United Kingdom' },
                ]}
              />

              <Textarea
                label="Passport Number & Expiry"
                error="TIMS requires a passport with at least 6 months validity"
                required
                rows={3}
              />
            </div>

            {/* Disabled States */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E9994]">
                Disabled States
              </h3>
              <Input
                label="National Park Entry Permit Fee"
                defaultValue="$30.00 USD (Fixed by Govt.)"
                disabled
                hint="Non-negotiable government fee automatically included"
              />

              <Select
                label="Currency Denomination"
                disabled
                options={[{ value: 'usd', label: 'USD ($) — Standard' }]}
                hint="International marketplace settled in USD"
              />

              <Textarea
                label="Insurance Coverage Terms"
                disabled
                defaultValue="Policy must include emergency helicopter evacuation up to 6,000m."
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: RESPONSIVE STACKING TABLE (<720px CARDS)
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
                7. Table, Row, Cell (Responsive Stacking)
              </h2>
              <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
                <strong className="text-[#1E4B8F]">CRITICAL RULE:</strong> Below 720px, the table automatically stacks into cards with column labels via <code className="font-mono text-[#D97706]">data-label</code>. Never horizontally scrolls.
              </p>
            </div>
            <Badge tone="info">Resize browser below 720px to preview stacking</Badge>
          </div>

          <div className="border border-[#E8E4DD] rounded-lg overflow-hidden bg-[#FFFFFF]">
            <Table caption="Sample Trek Departures and Verified Agencies">
              <TableHeader>
                <tr>
                  <TableHeadCell>Trek Title</TableHeadCell>
                  <TableHeadCell>Agency</TableHeadCell>
                  <TableHeadCell>Difficulty</TableHeadCell>
                  <TableHeadCell>Duration</TableHeadCell>
                  <TableHeadCell>Departure</TableHeadCell>
                  <TableHeadCell>Price / Guest</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                </tr>
              </TableHeader>
              <TableBody>
                <Row>
                  <Cell dataLabel="Trek Title" className="font-semibold font-serif">
                    Everest Base Camp & Kala Patthar
                  </Cell>
                  <Cell dataLabel="Agency">Himalayan Sherpa Treks</Cell>
                  <Cell dataLabel="Difficulty">
                    <LevelBadge difficulty="Difficult" showDifficultyName={false} />
                  </Cell>
                  <Cell dataLabel="Duration">14 Days</Cell>
                  <Cell dataLabel="Departure">Oct 12, 2026</Cell>
                  <Cell dataLabel="Price / Guest">
                    <span className="font-bold text-[#D97706]">$1,350</span>
                  </Cell>
                  <Cell dataLabel="Status">
                    <Badge tone="verified">4 Spots Left</Badge>
                  </Cell>
                </Row>

                <Row highlight>
                  <Cell dataLabel="Trek Title" className="font-semibold font-serif">
                    Annapurna Sanctuary & ABC
                  </Cell>
                  <Cell dataLabel="Agency">Pokhara Mountain Guides</Cell>
                  <Cell dataLabel="Difficulty">
                    <LevelBadge difficulty="Moderate" showDifficultyName={false} />
                  </Cell>
                  <Cell dataLabel="Duration">10 Days</Cell>
                  <Cell dataLabel="Departure">Nov 04, 2026</Cell>
                  <Cell dataLabel="Price / Guest">
                    <span className="font-bold text-[#D97706]">$890</span>
                  </Cell>
                  <Cell dataLabel="Status">
                    <Badge tone="promo">Guaranteed</Badge>
                  </Cell>
                </Row>

                <Row>
                  <Cell dataLabel="Trek Title" className="font-semibold font-serif">
                    Manaslu Circuit & Larkya La
                  </Cell>
                  <Cell dataLabel="Agency">Wild Nepal Eco Tours</Cell>
                  <Cell dataLabel="Difficulty">
                    <LevelBadge difficulty="Challenging" showDifficultyName={false} />
                  </Cell>
                  <Cell dataLabel="Duration">16 Days</Cell>
                  <Cell dataLabel="Departure">Oct 28, 2026</Cell>
                  <Cell dataLabel="Price / Guest">
                    <span className="font-bold text-[#D97706]">$1,520</span>
                  </Cell>
                  <Cell dataLabel="Status">
                    <Badge tone="urgent">1 Spot Left</Badge>
                  </Cell>
                </Row>

                <Row>
                  <Cell dataLabel="Trek Title" className="font-semibold font-serif">
                    Langtang Valley & Kyanjin Gompa
                  </Cell>
                  <Cell dataLabel="Agency">Tamang Heritage Cooperative</Cell>
                  <Cell dataLabel="Difficulty">
                    <LevelBadge difficulty="Easy" showDifficultyName={false} />
                  </Cell>
                  <Cell dataLabel="Duration">7 Days</Cell>
                  <Cell dataLabel="Departure">Dec 01, 2026</Cell>
                  <Cell dataLabel="Price / Guest">
                    <span className="font-bold text-[#D97706]">$590</span>
                  </Cell>
                  <Cell dataLabel="Status">
                    <Badge tone="neutral">Open</Badge>
                  </Cell>
                </Row>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: SKELETONS, EMPTY STATES, ERROR STATES
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              8. Feedback & Asynchronous States
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              LoadingSkeleton, EmptyState, and ErrorState — clean matte placeholders and clear messaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading Skeleton */}
            <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">
                  LoadingSkeleton
                </h3>
                <span className="text-xs text-[#8E9994]">Matte Pulse</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <LoadingSkeleton variant="circle" />
                  <div className="space-y-1.5 flex-1">
                    <LoadingSkeleton variant="text" width="60%" />
                    <LoadingSkeleton variant="text" width="40%" />
                  </div>
                </div>
                <LoadingSkeleton variant="rect" height={80} />
                <div className="space-y-1">
                  <LoadingSkeleton variant="text" />
                  <LoadingSkeleton variant="text" width="85%" />
                  <LoadingSkeleton variant="text" width="70%" />
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div>
              <EmptyState
                title="No Departures Found"
                description="Try broadening your dates or selecting an alternative Himalayan valley."
                icon={<Mountain className="w-6 h-6" />}
                actionText="Reset Filters"
                onAction={() => setActiveChip('All')}
              />
            </div>

            {/* Error State */}
            <div>
              <ErrorState
                title="Failed to Load Availability"
                message="Unable to communicate with the departure calendar. Please retry."
                retryText="Retry Connection"
                onRetry={() => alert('Retry action triggered successfully.')}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: MODAL & CONFIRM DIALOG
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              9. Modal & ConfirmDialog
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Escape key closes, focus moves inside, background scroll locked, and strictly NO backdrop-blur.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#E8E4DD] bg-[#FBF8F3] flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Open Standard Modal
            </Button>

            <Button
              variant="destructive"
              onClick={() => setIsConfirmOpen(true)}
              leftIcon={<AlertCircle className="w-4 h-4" />}
            >
              Open Confirm Dialog
            </Button>

            {confirmStatus && (
              <span className="text-xs font-semibold text-[#1B7A5A] ml-2">
                Last Action: {confirmStatus}
              </span>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: SHADCN/UI INTERACTIVE SUITE
            (Tabs, Popover, Calendar, Sheet, DropdownMenu, Toast, Skeleton)
           ========================================================================= */}
        <section>
          <div className="border-b border-[#E8E4DD] pb-3 mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1A1F1D]">
              10. shadcn/ui Component Suite
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
              Base components styled to Into Nepal's matte design tokens: Tabs, Sheet drawer, Popover, Calendar, DropdownMenu, Sonner Toasts, and Skeletons.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Tabs & Drawer (Sheet) */}
            <div className="space-y-6">
              {/* Tabs Component */}
              <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                  Tabs (Segmented View Switcher)
                </h3>
                <Tabs defaultValue="highlights" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 bg-[#FBF8F3] border border-[#E8E4DD] p-1 rounded-md">
                    <TabsTrigger
                      value="highlights"
                      className="text-xs font-semibold data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#1A1F1D] data-[state=active]:border data-[state=active]:border-[#E8E4DD] data-[state=active]:shadow-none transition-all py-1.5 rounded"
                    >
                      Highlights
                    </TabsTrigger>
                    <TabsTrigger
                      value="itinerary"
                      className="text-xs font-semibold data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#1A1F1D] data-[state=active]:border data-[state=active]:border-[#E8E4DD] data-[state=active]:shadow-none transition-all py-1.5 rounded"
                    >
                      Itinerary
                    </TabsTrigger>
                    <TabsTrigger
                      value="gear"
                      className="text-xs font-semibold data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#1A1F1D] data-[state=active]:border data-[state=active]:border-[#E8E4DD] data-[state=active]:shadow-none transition-all py-1.5 rounded"
                    >
                      Gear Guide
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="highlights" className="mt-4 text-xs text-[#5F6B66] space-y-2">
                    <p className="leading-relaxed">
                      Reach Kala Patthar (5,644m) for sunrise panoramic views of Mount Everest, Lhotse, Nuptse, and Ama Dablam.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Badge tone="verified">Max Alt: 5,644m</Badge>
                      <Badge tone="info">14 Days</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="itinerary" className="mt-4 text-xs text-[#5F6B66] space-y-2">
                    <p className="leading-relaxed">
                      Day 1: Fly Kathmandu to Lukla (2,860m), trek to Phakding. Day 2: Phakding to Namche Bazaar (3,440m).
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Badge tone="neutral">Grade: Challenging</Badge>
                      <Badge tone="promo">Acclimatization Day</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="gear" className="mt-4 text-xs text-[#5F6B66] space-y-2">
                    <p className="leading-relaxed">
                      Mandatory: 4-season down jacket (-15°C rating), broken-in trekking boots, microspikes, and trekking poles.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Badge tone="urgent">Winter Gear Req.</Badge>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sheet & Popover & Dropdown */}
              <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                  Interactive Overlays: Sheet, Dropdown & Popover
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Sheet Component (Matte Drawer) */}
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger
                      render={
                        <Button variant="secondary" size="sm" leftIcon={<PackageCheck className="w-4 h-4" />}>
                          Open Gear Checklist (Sheet)
                        </Button>
                      }
                    />
                    <SheetContent className="bg-[#FFFFFF] border-l border-[#E8E4DD] p-6 shadow-none max-w-md">
                      <SheetHeader>
                        <SheetTitle className="font-serif text-xl font-bold text-[#1A1F1D]">
                          Everest Expedition Gear
                        </SheetTitle>
                        <SheetDescription className="text-xs text-[#5F6B66]">
                          Pre-departure verification list for Khumbu high-altitude treks.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4 space-y-3 text-xs text-[#1A1F1D]">
                        <div className="flex items-center justify-between p-2.5 rounded border border-[#E8E4DD] bg-[#FBF8F3]">
                          <span>Down Sleeping Bag (-20°C)</span>
                          <Badge tone="verified">Included</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded border border-[#E8E4DD] bg-[#FBF8F3]">
                          <span>Waterproof Hard Shell Pants</span>
                          <Badge tone="urgent">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded border border-[#E8E4DD] bg-[#FBF8F3]">
                          <span>Diamox (Acetazolamide)</span>
                          <Badge tone="info">Recommended</Badge>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[#E8E4DD] flex justify-end">
                        <Button variant="primary" size="sm" onClick={() => setIsSheetOpen(false)}>
                          Done Checking
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="outline" size="sm" leftIcon={<MoreVertical className="w-4 h-4" />}>
                          Trek Options
                        </Button>
                      }
                    />
                    <DropdownMenuContent className="w-48 bg-[#FFFFFF] border border-[#E8E4DD] shadow-md p-1 rounded-md">
                      <DropdownMenuLabel className="text-[11px] font-semibold text-[#5F6B66] px-2 py-1">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        className="text-xs text-[#1A1F1D] px-2 py-1.5 rounded cursor-pointer hover:bg-[#FBF8F3]"
                        onClick={() => toast.success('Added to your Nepal Wishlist!')}
                      >
                        <Heart className="w-3.5 h-3.5 mr-2 text-[#C8362E]" />
                        Save to Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs text-[#1A1F1D] px-2 py-1.5 rounded cursor-pointer hover:bg-[#FBF8F3]"
                        onClick={() => toast.info('PDF dossier download initiated.')}
                      >
                        <FileDown className="w-3.5 h-3.5 mr-2 text-[#1E4B8F]" />
                        Download PDF Route
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="h-px bg-[#E8E4DD] my-1" />
                      <DropdownMenuItem
                        className="text-xs text-[#1A1F1D] px-2 py-1.5 rounded cursor-pointer hover:bg-[#FBF8F3]"
                        onClick={() => toast('Link copied to clipboard!')}
                      >
                        <Share2 className="w-3.5 h-3.5 mr-2 text-[#5F6B66]" />
                        Share Package
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Popover */}
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button variant="ghost" size="sm" leftIcon={<Info className="w-4 h-4 text-[#1E4B8F]" />}>
                          Altitude Advisory
                        </Button>
                      }
                    />
                    <PopoverContent className="w-72 bg-[#FFFFFF] border border-[#E8E4DD] shadow-md p-4 rounded-md text-xs space-y-2">
                      <h4 className="font-bold text-[#1A1F1D]">Acclimatization Rules</h4>
                      <p className="text-[#5F6B66] leading-relaxed">
                        Above 3,000 meters, limit sleeping altitude gain to 300–500 meters per day and schedule a mandatory rest day every 3–4 days.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Toast Triggers (Sonner) */}
              <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                  Sonner Toast Notifications
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      toast.success('Permit Verified!', {
                        description: 'TIMS card & Sagarmatha National Park entry pass confirmed.',
                      })
                    }
                  >
                    Trigger Success Toast
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      toast.info('Departure Notice', {
                        description: 'Lukla flights currently experiencing a 30m weather delay.',
                      })
                    }
                  >
                    Trigger Info Toast
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      toast.error('Booking Unavailable', {
                        description: 'The selected tea-house lodge has reached full capacity.',
                      })
                    }
                  >
                    Trigger Error Toast
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Calendar & Skeleton */}
            <div className="space-y-6">
              {/* Calendar Component */}
              <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66]">
                    Calendar (Departure Date Picker)
                  </h3>
                  {selectedDate && (
                    <span className="text-xs font-semibold text-[#1E4B8F]">
                      Selected: {selectedDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex justify-center border border-[#E8E4DD] rounded-lg p-2 bg-[#FBF8F3]">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                  />
                </div>
              </div>

              {/* Skeleton Component */}
              <div className="border border-[#E8E4DD] rounded-lg p-5 bg-[#FFFFFF]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6B66] mb-3">
                  Shadcn Skeleton Primitives
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#E8E4DD]/70" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4 bg-[#E8E4DD]/70 rounded" />
                      <Skeleton className="h-3 w-1/2 bg-[#E8E4DD]/50 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full bg-[#E8E4DD]/60 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Standard Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Departure Date"
        description="Select spots and review your Nepal trek reservation."
      >
        <div className="space-y-4 pt-2">
          <div className="bg-[#FBF8F3] border border-[#E8E4DD] rounded-lg p-3.5 text-xs text-[#5F6B66]">
            <strong className="text-[#1A1F1D]">Matte Finish Verification:</strong> Notice that the dark overlay behind this dialog has solid opacity and zero backdrop blur, ensuring high contrast and crisp focus. Press <kbd className="font-mono bg-[#E8E4DD] px-1 rounded">Escape</kbd> to close.
          </div>

          <Input
            label="Lead Traveler Full Name"
            placeholder="e.g. Maya Sherpa"
            defaultValue="Alex Harrison"
          />

          <Select
            label="Party Size"
            options={[
              { value: '1', label: '1 Solo Traveler' },
              { value: '2', label: '2 Travelers' },
              { value: '4', label: '4 Travelers (Group Discount)' },
            ]}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E8E4DD]">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                setConfirmStatus('Modal form submitted');
              }}
            >
              Save Reservation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog Demo */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          setConfirmStatus('Booking cancellation confirmed');
        }}
        title="Cancel Trek Booking?"
        message="Are you sure you want to cancel this booking? This will release reserved spots back to the agency."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        variant="destructive"
      />

      {/* Into Nepal Styled Sonner Toaster */}
      <Toaster position="bottom-right" />
    </div>
  );
};
