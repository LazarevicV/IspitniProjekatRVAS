import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  newReviewContent: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  newReviewGrade: number;
  onGradeChange: (grade: number) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  open,
  onClose,
  newReviewContent,
  onContentChange,
  onSubmit,
  newReviewGrade,
  onGradeChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[600px] overflow-scroll">
        <DialogHeader>
          <h3>Add Review</h3>
          <DialogDescription>
            <div className="flex flex-col gap-4 mt-10">
              {/* Grade selection buttons */}
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <button
                    key={grade}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                      newReviewGrade === grade
                        ? "font-bold bg-slate-700 hover:bg-slate-600"
                        : ""
                    }`}
                    onClick={() => onGradeChange(grade)}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              {/* Review content textarea */}
              <Textarea
                onChange={onContentChange}
                value={newReviewContent}
                placeholder="Enter your review here..."
              />
              {/* Submit and Cancel buttons */}
              <div className="flex justify-end">
                <Button onClick={onSubmit}>Submit</Button>
                <Button onClick={onClose} className="ml-2">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { AddReviewModal };
