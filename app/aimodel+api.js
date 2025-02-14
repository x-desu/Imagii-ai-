import Replicate from "replicate";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const modelConfigs = {
  "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637":
    {
      scheduler: "K_EULER",
      num_outputs: 1,
      guidance_scale: 0,
      negative_prompt: "worst quality, low quality",
      num_inference_steps: 4,
    },
  "fofr/sticker-maker:4acb778eb059772225ec213948f0660867b2e03f277448f18cf1800b96a65a1a":
    {
      output_quality: 100,
      negative_prompt: "",
      number_of_images: 1,
      steps: 17,
    },
  "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0":
    {
      cfg_scale: 1.2,
      num_steps: 4,
      image_width: 768,
      image_height: 1024,
      num_samples: 4,
      output_format: "webp",
      identity_scale: 0.8,
      mix_identities: false,
      output_quality: 80,
      generation_mode: "fidelity",
      negative_prompt:
        "flaws in the eyes, flaws in the face, flaws, lowres, non-HDRi, low quality, worst quality, artifacts noise, text, watermark, glitch, deformed, mutated, ugly, disfigured, hands, low resolution, partially rendered objects, deformed or partially rendered eyes, deformed, deformed eyeballs, cross-eyed, blurry",
    },
  "fofr/face-to-many:a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf":
    {
      lora_scale: 1,
      negative_prompt: "",
      prompt_strength: 4.5,
      denoising_strength: 0.65,
      instant_id_strength: 0.8,
      control_depth_strength: 0.8,
    },
  "zf-kbot/photo-to-anime:7936c014091521e64f3721090cc878ab1bceb2d5e0deecc4549092fb7f9ba753":
    {
      strength: 0.5,
      scheduler: "K_EULER_ANCESTRAL",
      num_outputs: 1,
      guidance_scale: 6,
      negative_prompt: "",
      num_inference_steps: 20,
    },
};

export async function POST(request) {
  let inputOption = "";
  try {
    const data = await request.json();
    console.log("📥 Received Data:", data);

    const version = data?.aiModelName?.split(":")[1];

    const inputOption = modelConfigs[data?.aiModelName] || {};

    if (!version) {
      throw new Error(
        "Invalid aiModelName format. Expected 'modelName:versionId'."
      );
    }

    console.log("🛠 Using Model Version:", version);

    // Start prediction request
    let prediction = await replicate.predictions.create({
      version,
      input: {
        prompt: data.inputPrompt + " " + data.defaultPrompt,
        ...inputOption,
        main_face_image: data?.main_face_image,
        image: data?.image,
        style: data?.style,
        mode: data?.mode,
      },
    });

    console.log("⏳ Initial Prediction Status:", prediction.status);

    // Poll the API every second
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      prediction = await replicate.predictions.get(prediction.id);
      console.log("🔄 Updated Prediction Status:", prediction.status);
    }

    // If the prediction was successful, return the image URL
    if (prediction.status === "succeeded") {
      const imageUrl =
        typeof prediction.output?.[0] === "string" &&
        prediction.output[0].startsWith("http")
          ? prediction.output[0]
          : prediction.output;
      console.log("✅ Generated Image URL:", imageUrl);

      return new Response(JSON.stringify({ result: imageUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("❌ Prediction Failed:", prediction.error);

      return new Response(
        JSON.stringify({ error: prediction.error || "Unknown error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("⚠️ Error:", error.message);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// export async function POST(request) {
//   const data = await request.json();
//   const output = await replicate.run(
//     "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
//     {
//       input: {
//         width: 1024,
//         height: 1024,
//         prompt: data?.inputPrompt,
//         scheduler: "K_EULER",
//         num_outputs: 1,
//         guidance_scale: 7.5,
//         negative_prompt: "worst quality, low quality",
//         num_inference_steps: 50,
//       },
//     }
//   );
//   console.log(output);
//   return Response.json({ result: output[0] });
// }
