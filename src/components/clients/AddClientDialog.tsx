'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/hooks/useClients';

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const { dispatch } = useClients();
  const router = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [dapeiZahavUrl, setDapeiZahavUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [urlError, setUrlError] = useState('');
  const [nameError, setNameError] = useState('');

  function resetForm() {
    setBusinessName('');
    setWebsiteUrl('');
    setDapeiZahavUrl('');
    setNotes('');
    setUrlError('');
    setNameError('');
  }

  function isValidUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let valid = true;
    setUrlError('');
    setNameError('');

    if (!businessName.trim()) {
      setNameError('שם העסק הוא שדה חובה');
      valid = false;
    }

    const website = websiteUrl.trim();
    const dapei = dapeiZahavUrl.trim();

    if (!website && !dapei) {
      setUrlError('יש להזין לפחות כתובת URL אחת (אתר או דפי זהב)');
      valid = false;
    } else {
      if (website && !isValidUrl(website)) {
        setUrlError('כתובת אתר האינטרנט אינה תקינה');
        valid = false;
      } else if (dapei && !isValidUrl(dapei)) {
        setUrlError('כתובת דפי זהב אינה תקינה');
        valid = false;
      }
    }

    if (!valid) return;

    const id = nanoid();
    dispatch({
      type: 'ADD_CLIENT',
      client: {
        id,
        businessName: businessName.trim(),
        websiteUrl: website || undefined,
        dapeiZahavUrl: dapei || undefined,
        notes: notes.trim() || undefined,
        status: 'ממתין',
        createdAt: new Date().toISOString(),
      },
    });

    resetForm();
    onOpenChange(false);
    router.push(`/clients/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הוספת לקוח חדש</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="businessName">שם העסק</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="לדוגמה: קירור ומיזוג אבי כהן"
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="websiteUrl">URL אתר אינטרנט</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.co.il"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dapeiZahavUrl">URL דפי זהב</Label>
            <Input
              id="dapeiZahavUrl"
              type="url"
              value={dapeiZahavUrl}
              onChange={(e) => setDapeiZahavUrl(e.target.value)}
              placeholder="https://www.d.co.il/he/p/..."
              dir="ltr"
            />
          </div>

          {urlError && (
            <p className="text-sm text-red-500">{urlError}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">הערות (אופציונלי)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="מידע נוסף על הלקוח..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { resetForm(); onOpenChange(false); }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="bg-zap-orange hover:bg-zap-orange-dark text-white"
            >
              הוסף לקוח
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
