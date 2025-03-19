
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import TaxUpdateDetails from './TaxUpdateDetails';
import { TaxUpdate } from './types';

interface TaxUpdateCardProps {
  update: TaxUpdate;
  index: number;
}

const TaxUpdateCard = ({ update, index }: TaxUpdateCardProps) => {
  return (
    <Card 
      key={update.id} 
      className="section-animate transform-gpu transition-all duration-700 ease-out opacity-0 translate-y-4 will-change-transform"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-tax-blue">{update.title}</CardTitle>
          <Badge variant="outline" className="bg-tax-blue/10">{update.category}</Badge>
        </div>
        <CardDescription>{update.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mb-4">{update.description}</p>
        <p className="text-sm text-muted-foreground">{update.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs text-muted-foreground">Source: Ministry of Finance, India</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Full source: {update.source}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="text-sm text-tax-blue hover:underline transition-all duration-300 hover:bg-tax-blue/5">
              Read More
            </Button>
          </SheetTrigger>
          <TaxUpdateDetails update={update} />
        </Sheet>
      </CardFooter>
    </Card>
  );
};

export default TaxUpdateCard;
