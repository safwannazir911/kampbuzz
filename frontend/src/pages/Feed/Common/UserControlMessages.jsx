import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircle } from "lucide-react"

const UserControlMessages = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <MessageCircle />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
          <SheetDescription>
            When available, you will be able to directly contact Universities.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default UserControlMessages
