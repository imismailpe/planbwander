import { getPlaceInfo } from '../../../mcps/placeinfo';

export async function POST(req) {
  const body = await req.json();
  const { input } = body;

  const aiResp = await getPlaceInfo(input.content);
  return new Response(JSON.stringify(aiResp), {
    status: 200,
  });
}
