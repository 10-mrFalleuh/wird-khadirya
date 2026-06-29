import { useState, useCallback, useEffect, useRef } from 'react';
import { useHaptic } from '../hooks/useHaptic';
import { useAppStore } from '../store/appStore';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SibhaProps {
  wirdId: number;
  litanyId: number;
  target: number;
  onComplete?: () => void;
}

type BeadStyle = 'classic' | 'modern' | 'minimal' | 'luxury';

const BEAD_STYLES = {
  classic: { primary: '#e74c3c', dark: '#c0392b', border: '#27ae60', size: 45, borderRadius: '50%' },
  modern: { primary: '#3498db', dark: '#2980b9', border: '#2c3e50', size: 45, borderRadius: '12px' },
  minimal: { primary: '#95a5a6', dark: '#7f8c8d', border: '#7f8c8d', size: 35, borderRadius: '50%', borderWidth: '2px' },
  luxury: { primary: '#f1c40f', dark: '#f39c12', border: '#d4af37', size: 45, borderRadius: '50%', background: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)', boxShadow: '0 4px 15px rgba(241, 196, 15, 0.4)' }
};

export default function Sibha({ wirdId, litanyId, target, onComplete }: SibhaProps) {
  const { t } = useTranslation();
  const { lightTap, strongTap, milestoneTap } = useHaptic();
  const { incrementCounter, decrementCounter, resetCounter, getCounter } = useAppStore();
  const count = getCounter(wirdId, litanyId);
  const [showMilestone, setShowMilestone] = useState(false);
  const [animateCount, setAnimateCount] = useState(false);
  const [beadStyle, setBeadStyle] = useState<BeadStyle>('classic');
  const tapAreaRef = useRef<HTMLDivElement>(null);

  const isComplete = count >= target;

  const handleIncrement = useCallback(() => {
    if (isComplete) return;

    incrementCounter(wirdId, litanyId);
    setAnimateCount(true);
    setTimeout(() => setAnimateCount(false), 100);

    const newCount = count + 1;

    // Haptic feedback
    if (newCount === target) {
      milestoneTap();
      setShowMilestone(true);
      setTimeout(() => {
        setShowMilestone(false);
        onComplete?.();
      }, 1500);
    } else if (newCount % 33 === 0 || newCount === target - 1) {
      strongTap();
    } else {
      lightTap();
    }
  }, [count, target, isComplete, wirdId, litanyId, incrementCounter, lightTap, strongTap, milestoneTap, onComplete]);

  const handleDecrement = useCallback(() => {
    if (count > 0) {
      decrementCounter(wirdId, litanyId);
      lightTap();
    }
  }, [count, decrementCounter, wirdId, litanyId, lightTap]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleIncrement();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleDecrement();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleIncrement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleIncrement, handleDecrement]);

  const handleReset = () => {
    resetCounter(wirdId, litanyId);
    strongTap();
  };

  // Swipe handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);
    
    // Only trigger swipe if horizontal movement is greater than vertical movement
    if (diffY < 50) {
      if (diffX > 30) { 
        // Swipe left (right to left) -> increment
        handleIncrement();
      } else if (diffX < -30) { 
        // Swipe right (left to right) -> decrement
        handleDecrement();
      } else {
        // Just a tap
        handleIncrement();
      }
    } else {
      // It was a vertical scroll, don't increment on tap
    }
  };

  const currentStyle = BEAD_STYLES[beadStyle];
  
  // Beads curve calculation
  const CONTAINER_WIDTH = 300;
  const BEAD_SPACING = 55;
  const CENTER_X = CONTAINER_WIDTH / 2;
  
  const getBeadY = (x: number) => {
    const u = x / CONTAINER_WIDTH;
    // Parabola: y = 20 + 320u - 320u^2
    // At u=0 (x=0), y=20
    // At u=0.5 (x=150), y=100
    // At u=1 (x=300), y=20
    return 20 + 320 * u - 320 * u * u;
  };

  // Generate visible beads
  const visibleBeads = [];
  // Show beads from count - 4 to count + 4
  for (let i = Math.max(0, count - 4); i <= count + 4; i++) {
    visibleBeads.push(i);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-2">
        <div className={`text-5xl sm:text-6xl font-bold text-primary-500 my-1 transition-transform duration-100 ${animateCount ? 'scale-110' : ''}`}>
          {count}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          {t('of')} <span className="font-semibold">{target}</span>
        </div>
      </div>

      {/* Interactive Beads Area */}
      <div 
        ref={tapAreaRef}
        className="relative w-[300px] h-[160px] my-4 cursor-pointer select-none touch-none"
        onClick={(e) => {
          // Only handle click if it's not a touch event (touch is handled by touchEnd)
          if (e.nativeEvent.pointerType === 'mouse') {
            handleIncrement();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* String */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 160">
          <path 
            d="M 0 20 Q 150 180 300 20" 
            fill="none" 
            stroke="rgba(156, 163, 175, 0.4)" 
            strokeWidth="2" 
          />
        </svg>

        {/* Beads */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <AnimatePresence>
            {visibleBeads.map(i => {
              const v = i - count;
              const x = CENTER_X + v * BEAD_SPACING;
              const y = getBeadY(x);
              
              // Don't render if too far outside
              if (x < -50 || x > 350) return null;

              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ 
                    x: x - currentStyle.size / 2, 
                    y: y - currentStyle.size / 2,
                    scale: v === 0 ? 1.1 : 1,
                    opacity: Math.abs(v) > 2 ? 1 - (Math.abs(v) - 2) * 0.4 : 1
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 30,
                    mass: 1
                  }}
                  className="absolute top-0 left-0"
                  style={{
                    width: currentStyle.size,
                    height: currentStyle.size,
                    background: currentStyle.background || `radial-gradient(circle at 30% 30%, ${currentStyle.primary}, ${currentStyle.dark})`,
                    border: `${currentStyle.borderWidth || '3px'} solid ${currentStyle.border}`,
                    borderRadius: currentStyle.borderRadius,
                    boxShadow: currentStyle.boxShadow || '2px 4px 8px rgba(0,0,0,0.2)',
                    zIndex: 10 - Math.abs(v)
                  }}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Completion Checkmark */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl z-20"
            >
              <div className="bg-green-500 rounded-full p-4 shadow-lg">
                <Check className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 mb-4 text-center">
        Glissez vers la gauche pour incrémenter<br/>
        Glissez vers la droite pour décrémenter
      </div>

      {/* Style Selector */}
      <div className="w-full max-w-[200px] mb-2">
        <select 
          value={beadStyle}
          onChange={(e) => setBeadStyle(e.target.value as BeadStyle)}
          className="w-full p-2 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:border-primary-500 transition-colors"
        >
          <option value="classic">🔴 Classique</option>
          <option value="modern">🔵 Moderne</option>
          <option value="minimal">⚪ Minimal</option>
          <option value="luxury">🟡 Luxe</option>
        </select>
      </div>

      {/* Milestone toast */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="mt-2 badge-pill text-xs bg-gold-100 dark:bg-gold-500/20 text-gold-600 dark:text-gold-300 border border-gold-200 dark:border-gold-500/30"
          >
            ✨ {t('wirdComplete')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset */}
      {count > 0 && (
        <button
          onClick={handleReset}
          className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('reset')}
        </button>
      )}
    </div>
  );
}
