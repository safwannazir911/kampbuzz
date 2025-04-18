import { useState, forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"

const CommonCombinedInput = forwardRef(
  ({ className, type, rows, variant = "outlined", ...props }, ref) => {
    const isTextarea = rows && rows > 1
    const isPasswordInput = type === "password"

    const [showPassword, setShowPassword] = useState(false)
    const disabled =
      props.value === "" || props.value === undefined || props.disabled

    const inputElement = isTextarea ? (
      <Textarea
        ref={ref}
        rows={rows}
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    ) : isPasswordInput ? (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        {/* Your custom password visibility toggle button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword && !disabled ? (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>

        {/* hides browsers password toggles */}
        <style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
      </div>
    ) : (
      <Input
        ref={ref}
        type={type || "text"}
        className={cn(
          "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )

    return isTextarea || isPasswordInput ? (
      <div className="relative">{inputElement}</div>
    ) : (
      inputElement
    )
  },
)

CommonCombinedInput.displayName = "CommonCombinedInput"

export default CommonCombinedInput
