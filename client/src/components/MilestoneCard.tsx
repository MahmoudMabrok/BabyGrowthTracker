import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, MeasurementEntry } from "@shared/schema";
import { BabyMilestoneIcon } from "@/components/icons/BabyMilestone";
import { Button } from "@/components/ui/button";
import { formatAge, formatDate, formatWeight, formatHeight } from "@/lib/utils";
import { Download, Share2 } from "lucide-react";
import html2canvas from "html2canvas";

interface MilestoneCardProps {
  baby: Baby;
  entry: MeasurementEntry;
  milestoneType?: 'newborn' | 'sitting' | 'crawling' | 'walking' | 'cute';
  title?: string;
  note?: string;
}

export function MilestoneCard({ 
  baby, 
  entry, 
  milestoneType = 'cute',
  title,
  note
}: MilestoneCardProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  const cardTitle = title || `${baby.name}'s Growth Milestone`;
  const cardNote = note || `Look how much I've grown!`;
  
  const ageMonths = Number(entry.ageMonths);
  const weight = entry.weight ? Number(entry.weight) : null;
  const height = entry.height ? Number(entry.height) : null;
  
  // Function to download the card as an image
  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    
    try {
      setIsGeneratingImage(true);
      
      // Add a class for capturing
      cardRef.current.classList.add('capturing');
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      });
      
      // Remove the capturing class
      cardRef.current.classList.remove('capturing');
      
      // Convert to data URL and download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${baby.name.replace(/\s+/g, '_')}_milestone_${formatAge(ageMonths).replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating milestone card image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  // Function to share the card
  const shareCard = async () => {
    if (!cardRef.current || !navigator.share) return;
    
    try {
      setIsGeneratingImage(true);
      
      // Add a class for capturing
      cardRef.current.classList.add('capturing');
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      });
      
      // Remove the capturing class
      cardRef.current.classList.remove('capturing');
      
      // Convert to blob for sharing
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        try {
          const file = new File([blob], `${baby.name}_milestone.png`, { type: 'image/png' });
          
          await navigator.share({
            title: cardTitle,
            text: cardNote,
            files: [file]
          });
        } catch (error) {
          console.error('Error sharing milestone card:', error);
          
          // Fallback if sharing API fails
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${baby.name.replace(/\s+/g, '_')}_milestone_${formatAge(ageMonths).replace(/\s+/g, '_')}.png`;
          link.href = dataUrl;
          link.click();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating milestone card image for sharing:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden shadow-lg relative border-2" ref={cardRef}>
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/30 to-primary/10 z-0"></div>
        
        <CardContent className="p-6 relative z-10">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-primary">{cardTitle}</h3>
            <p className="text-muted-foreground text-sm">{formatDate(entry.date)}</p>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="text-primary">
              <BabyMilestoneIcon type={milestoneType} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/40 rounded-lg p-3 text-center">
              <div className="text-sm text-muted-foreground">Age</div>
              <div className="text-lg font-semibold">{formatAge(ageMonths)}</div>
            </div>
            
            {weight && (
              <div className="bg-muted/40 rounded-lg p-3 text-center">
                <div className="text-sm text-muted-foreground">Weight</div>
                <div className="text-lg font-semibold">{formatWeight(weight)}</div>
              </div>
            )}
            
            {height && (
              <div className={`bg-muted/40 rounded-lg p-3 text-center ${!weight ? "col-span-2" : ""}`}>
                <div className="text-sm text-muted-foreground">Height</div>
                <div className="text-lg font-semibold">{formatHeight(height)}</div>
              </div>
            )}
          </div>
          
          {(entry.notes || cardNote) && (
            <div className="bg-muted/30 rounded-lg p-3 text-center mb-4">
              <p className="text-sm italic">"{entry.notes || cardNote}"</p>
            </div>
          )}
          
          <div className="text-center text-xs text-muted-foreground capturing-hide">
            Made with Baby Growth Tracker
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4 space-x-2 capturing-hide">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadAsImage}
          disabled={isGeneratingImage}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={shareCard}
            disabled={isGeneratingImage}
            className="flex items-center"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </div>
      
      {isGeneratingImage && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
}